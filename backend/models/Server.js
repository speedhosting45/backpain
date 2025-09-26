const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Server name is required'],
    trim: true,
    maxlength: [50, 'Server name cannot exceed 50 characters']
  },
  status: {
    type: String,
    enum: ['running', 'stopped'],
    default: 'stopped'
  },
  ramGB: {
    type: Number,
    required: true,
    min: [1, 'RAM must be at least 1 GB'],
    max: [16, 'RAM cannot exceed 16 GB']
  },
  usage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
serverSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Server', serverSchema);
