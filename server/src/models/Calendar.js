
const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Calendar name is required'],
    trim: true,
    maxlength: [100, 'Calendar name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  color: {
    type: String,
    default: '#3B82F6',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  settings: {
    allowMemberInvites: {
      type: Boolean,
      default: false
    },
    allowEventCreation: {
      type: Boolean,
      default: true
    },
    defaultEventDuration: {
      type: Number,
      default: 60 // minutes
    }
  }
}, {
  timestamps: true
});

// Indexes
calendarSchema.index({ owner: 1 });
calendarSchema.index({ 'members.user': 1 });

// Method to check if user has access to calendar
calendarSchema.methods.hasAccess = function(userId) {
  if (this.owner.toString() === userId.toString()) {
    return true;
  }
  
  return this.members.some(
    member => member.user.toString() === userId.toString()
  );
};

// Method to get user's role in calendar
calendarSchema.methods.getUserRole = function(userId) {
  if (this.owner.toString() === userId.toString()) {
    return 'owner';
  }
  
  const member = this.members.find(
    member => member.user.toString() === userId.toString()
  );
  
  return member ? member.role : null;
};

module.exports = mongoose.model('Calendar', calendarSchema);
