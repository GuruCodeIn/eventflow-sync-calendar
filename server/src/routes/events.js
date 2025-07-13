
const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Event = require('../models/Event');
const User = require('../models/User');

const router = express.Router();

// Get all events for user
router.get('/', [
  query('start').optional().isISO8601().withMessage('Start date must be valid ISO date'),
  query('end').optional().isISO8601().withMessage('End date must be valid ISO date'),
  query('calendar').optional().isMongoId().withMessage('Calendar ID must be valid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { start, end, calendar } = req.query;
    const userId = req.user._id;

    // Build query
    const query = {
      $or: [
        { createdBy: userId },
        { 'attendees.user': userId }
      ]
    };

    // Add date filters if provided
    if (start || end) {
      query.start = {};
      if (start) query.start.$gte = new Date(start);
      if (end) query.start.$lte = new Date(end);
    }

    // Add calendar filter if provided
    if (calendar) {
      query.calendar = calendar;
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .populate('attendees.user', 'name email')
      .sort({ start: 1 });

    // Filter out private events user doesn't own
    const filteredEvents = events.filter(event => event.canView(userId));

    res.json({
      events: filteredEvents,
      count: filteredEvents.length
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('attendees.user', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.canView(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Error fetching event' });
  }
});

// Create new event
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('start')
    .isISO8601()
    .withMessage('Start date must be valid ISO date'),
  body('end')
    .isISO8601()
    .withMessage('End date must be valid ISO date'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Location must be less than 300 characters'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be valid hex format'),
  body('isRecurring').optional().isBoolean(),
  body('recurrenceRule')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const eventData = {
      ...req.body,
      createdBy: req.user._id,
      start: new Date(req.body.start),
      end: new Date(req.body.end)
    };

    // Validate end date is after start date
    if (eventData.end <= eventData.start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const event = new Event(eventData);
    await event.save();

    await event.populate('createdBy', 'name email');

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`user_${req.user._id}`).emit('event_created', event);

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Update event
router.put('/:id', [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('start').optional().isISO8601().withMessage('Start date must be valid ISO date'),
  body('end').optional().isISO8601().withMessage('End date must be valid ISO date'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Location must be less than 300 characters'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be valid hex format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.canEdit(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updates = { ...req.body };
    if (updates.start) updates.start = new Date(updates.start);
    if (updates.end) updates.end = new Date(updates.end);

    // Validate end date is after start date if both are provided
    const startDate = updates.start || event.start;
    const endDate = updates.end || event.end;
    if (endDate <= startDate) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`user_${req.user._id}`).emit('event_updated', updatedEvent);

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.canEdit(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`user_${req.user._id}`).emit('event_deleted', { id: req.params.id });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
});

// Share event with user
router.post('/:id/share', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('permission')
    .isIn(['view', 'edit'])
    .withMessage('Permission must be view or edit')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.canEdit(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { email, permission } = req.body;

    // Find user to share with
    const userToShare = await User.findOne({ email });
    if (!userToShare) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already an attendee
    const existingAttendee = event.attendees.find(
      att => att.user.toString() === userToShare._id.toString()
    );

    if (existingAttendee) {
      existingAttendee.permission = permission;
    } else {
      event.attendees.push({
        user: userToShare._id,
        permission,
        status: 'pending'
      });
    }

    await event.save();
    await event.populate('attendees.user', 'name email');

    // Emit real-time update to shared user
    const io = req.app.get('io');
    io.to(`user_${userToShare._id}`).emit('event_shared', event);

    res.json({
      message: 'Event shared successfully',
      event
    });
  } catch (error) {
    console.error('Share event error:', error);
    res.status(500).json({ message: 'Error sharing event' });
  }
});

module.exports = router;
