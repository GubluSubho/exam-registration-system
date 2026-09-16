const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const logAction = require('../utils/logAction');

const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admins', error: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({ name, email, password: hashedPassword, role: 'admin' });

    await logAction(req.user.id, 'CREATE_ADMIN', 'User', admin._id, `Created admin account for ${email}`);

    res.status(201).json({
      message: 'Admin created',
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create admin', error: error.message });
  }
};

const deactivateAdmin = async (req, res) => {
  try {
    const admin = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: false },
      { new: true }
    );
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    await logAction(req.user.id, 'DEACTIVATE_ADMIN', 'User', admin._id, `Deactivated admin ${admin.email}`);

    res.json({ message: 'Admin deactivated', admin });
  } catch (error) {
    res.status(500).json({ message: 'Failed to deactivate admin', error: error.message });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const { action, actorId } = req.query;
    const filter = {};
    if (action) filter.action = action;
    if (actorId) filter.actor = actorId;

    const logs = await AuditLog.find(filter)
      .populate('actor', 'name email role')
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch audit logs', error: error.message });
  }
};

module.exports = { getAllAdmins, createAdmin, deactivateAdmin, getAuditLogs };