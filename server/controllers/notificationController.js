const Notification = require('../models/Notification');
const User = require('../models/User');
const createNotification = require('../utils/createNotification');

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notification', error: error.message });
  }
};

const broadcastNotification = async (req, res) => {
  try {
    const { title, message, targetRole, alsoEmail } = req.body; // targetRole: 'student' | 'faculty' | 'all'

    const filter = targetRole && targetRole !== 'all' ? { role: targetRole } : {};
    const users = await User.find(filter).select('_id');

    await Promise.all(
      users.map((u) => createNotification(u._id, title, message, 'general', alsoEmail))
    );

    res.json({ message: `Notification sent to ${users.length} users` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to broadcast notification', error: error.message });
  }
};

module.exports = { getMyNotifications, markAsRead, broadcastNotification };