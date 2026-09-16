const Duty = require('../models/Duty');
const Application = require('../models/Application');

const assignDuty = async (req, res) => {
  try {
    const { examId, facultyId, centerId, date, roomNumber } = req.body;
    const duty = await Duty.create({
      exam: examId,
      faculty: facultyId,
      center: centerId,
      date,
      roomNumber,
    });
    res.status(201).json({ message: 'Duty assigned', duty });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign duty', error: error.message });
  }
};

const getMyDuties = async (req, res) => {
  try {
    const duties = await Duty.find({ faculty: req.user.id })
      .populate('exam')
      .populate('center')
      .sort({ date: 1 });
    res.json(duties);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch duties', error: error.message });
  }
};

const getStudentsForAttendance = async (req, res) => {
  try {
    const { examId, centerId } = req.query;
    const applications = await Application.find({
      exam: examId,
      center: centerId,
      status: 'approved',
      paymentStatus: 'paid',
    }).populate('student', 'name email');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { applicationId, attendanceStatus } = req.body;
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { attendanceStatus },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Attendance updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
  }
};

module.exports = { assignDuty, getMyDuties, getStudentsForAttendance, markAttendance };