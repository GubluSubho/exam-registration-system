const Exam = require('../models/Exam');

const createExam = async (req, res) => {
  try {
    const {
      title, description, subject, examDate,
      applicationStartDate, applicationEndDate, fee, eligibility,
    } = req.body;

    if (new Date(applicationEndDate) <= new Date(applicationStartDate)) {
      return res.status(400).json({ message: 'Application end date must be after start date' });
    }
    if (new Date(examDate) <= new Date(applicationEndDate)) {
      return res.status(400).json({ message: 'Exam date must be after application end date' });
    }

    const exam = await Exam.create({
      title, description, subject, examDate,
      applicationStartDate, applicationEndDate, fee, eligibility,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create exam', error: error.message });
  }
};

const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch exams', error: error.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch exam', error: error.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam updated', exam });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update exam', error: error.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete exam', error: error.message });
  }
};

module.exports = { createExam, getAllExams, getExamById, updateExam, deleteExam };