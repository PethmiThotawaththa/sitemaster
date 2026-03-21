const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'SiteMaster' },
  emailNotifications: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Settings', settingsSchema);