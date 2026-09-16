const Notification = require('../models/Notification');
const sendEmail = require('./sendEmail');
const User = require('../models/User');

const createNotification = async (recipientId, title, message, type = 'general', alsoEmail = false) => {
  try {
    await Notification.create({ recipient: recipientId, title, message, type });

    if (alsoEmail) {
      const user = await User.findById(recipientId);
      if (user?.email) {
        await sendEmail(user.email, title, message);
      }
    }
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

module.exports = createNotification;