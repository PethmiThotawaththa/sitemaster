const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
  },
  clientEmail: {
    type: String,
    required: [true, 'Client email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: 0,
  },
  expenses: {
    type: Number,
    default: 0,
    min: 0,
  },
  expenseInterest: {
    type: Number,
    default: 0,
    min: 0,
  },
  interestRate: {
    type: Number,
    default: 0.05, // 5% annual interest rate
    min: 0,
  },
  interestCalculatedAt: {
    type: Date,
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  attachments: [{
    type: String,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);