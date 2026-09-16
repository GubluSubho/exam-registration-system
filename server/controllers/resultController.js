const Result = require('../models/Result');
const Application = require('../models/Application');
const { calculateGrade, calculatePassStatus } = require('../utils/grading');

const enterMarks = async (req, res) => {
  try {
    const { applicationId, marksObtained, maxMarks } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (marksObtained > maxMarks) {
      return res.status(400).json({ message: 'Marks obtained cannot exceed max marks' });
    }

    const grade = calculateGrade(marksObtained, maxMarks);
    const passStatus = calculatePassStatus(marksObtained, maxMarks);

    const result = await Result.findOneAndUpdate(
      { exam: application.exam, student: application.student },
      {
        exam: application.exam,
        student: application.student,
        application: applicationId,
        marksObtained,
        maxMarks,
        grade,
        passStatus,
        enteredBy: req.user.id,
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json({ message: 'Marks entered successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to enter marks', error: error.message });
  }
};

const publishResults = async (req, res) => {
  try {
    const { examId } = req.body;
    await Result.updateMany({ exam: examId }, { published: true });
    res.json({ message: 'Results published for this exam' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to publish results', error: error.message });
  }
};

const unpublishResults = async (req, res) => {
  try {
    const { examId } = req.body;
    await Result.updateMany({ exam: examId }, { published: false });
    res.json({ message: 'Results unpublished for this exam' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unpublish results', error: error.message });
  }
};

const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.id, published: true }).populate('exam');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch results', error: error.message });
  }
};

module.exports = { enterMarks, publishResults, unpublishResults, getMyResults };