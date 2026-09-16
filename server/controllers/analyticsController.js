const Exam = require('../models/Exam');
const Application = require('../models/Application');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalExams = await Exam.countDocuments();
    const totalApplications = await Application.countDocuments();

    const paidApplications = await Application.find({ paymentStatus: 'paid' }).populate('exam');
    const totalRevenue = paidApplications.reduce((sum, app) => sum + (app.exam?.fee || 0), 0);

    const statusBreakdown = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const examWiseApplications = await Application.aggregate([
      {
        $lookup: {
          from: 'exams',
          localField: 'exam',
          foreignField: '_id',
          as: 'examInfo',
        },
      },
      { $unwind: '$examInfo' },
      {
        $group: {
          _id: '$examInfo.title',
          applications: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalStudents,
      totalExams,
      totalApplications,
      totalRevenue,
      statusBreakdown,
      examWiseApplications,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

module.exports = { getDashboardStats };