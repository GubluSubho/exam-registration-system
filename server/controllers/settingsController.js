const Settings = require('../models/Settings');
const logAction = require('../utils/logAction');

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSingleton();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.getSingleton();
    Object.assign(settings, req.body, { updatedBy: req.user.id });
    await settings.save();

    await logAction(req.user.id, 'UPDATE_SETTINGS', 'Settings', settings._id, 'System settings updated');

    res.json({ message: 'Settings updated', settings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
};

module.exports = { getSettings, updateSettings };