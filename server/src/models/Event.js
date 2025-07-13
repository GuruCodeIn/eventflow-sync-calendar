
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  start: {
    type: Date,
    required: [true, 'Start date is required']
  },
  end: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.start;
      },
      message: 'End date must be after start date'
    }
  },
  location: {
    type: String,
    trim: true,
    maxlength: [300, 'Location cannot exceed 300 characters']
  },
  color: {
    type: String,
    default: '#3B82F6',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format']
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrenceRule: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: null
  },
  recurrenceEnd: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  calendar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Calendar',
    default: null
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    permission: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'push'],
      required: true
    },
    minutes: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
eventSchema.index({ createdBy: 1, start: 1 });
eventSchema.index({ start: 1, end: 1 });
eventSchema.index({ 'attendees.user': 1 });

// Virtual for duration
eventSchema.virtual('duration').get(function() {
  return this.end - this.start;
});

// Method to check if user can edit event
eventSchema.methods.canEdit = function(userId) {
  if (this.createdBy.toString() === userId.toString()) {
    return true;
  }
  
  const attendee = this.attendees.find(
    att => att.user.toString() === userId.toString()
  );
  
  return attendee && attendee.permission === 'edit';
};

// Method to check if user can view event
eventSchema.methods.canView = function(userId) {
  if (this.createdBy.toString() === userId.toString()) {
    return true;
  }
  
  if (this.isPrivate) {
    return false;
  }
  
  const attendee = this.attendees.find(
    att => att.user.toString() === userId.toString()
  );
  
  return !!attendee;
};

module.exports = mongoose.model('Event', eventSchema);
