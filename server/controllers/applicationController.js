const Application = require('../models/Application');
const Exam = require('../models/Exam');
const razorpayInstance = require('../utils/razorpay');
const crypto = require('crypto');
const generateHallTicketPDF = require('../utils/generateHallTicket');
const Center = require('../models/Center');
const createNotification = require('../utils/createNotification');
const logAction = require('../utils/logAction');

const applyToExam = async (req, res) => {
  try {
    const { examId } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const now = new Date();
    if (now < exam.applicationStartDate || now > exam.applicationEndDate) {
      return res.status(400).json({ message: 'Application window is closed for this exam' });
    }

    const existing = await Application.findOne({ exam: examId, student: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this exam' });
    }

    const application = await Application.create({
      exam: examId,
      student: req.user.id,
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply', error: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id }).populate('exam');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};

const createPaymentOrder = async (req, res) => {
  try {
    const { applicationId } = req.body;

    const application = await Application.findById(applicationId).populate('exam');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized for this application' });
    }
    if (application.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Already paid' });
    }

    const order = await razorpayInstance.orders.create({
      amount: application.exam.fee * 100, // paise
      currency: 'INR',
      receipt: `receipt_${applicationId}`,
    });

    res.json({ order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment order', error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { applicationId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    await Application.findByIdAndUpdate(applicationId, { paymentStatus: 'paid' });

    res.json({ message: 'Payment verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Payment verification error', error: error.message });
  }
};

const downloadHallTicket = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('exam')
      .populate('student', 'name email')
      .populate('center');

    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.student._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (application.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Complete payment before downloading hall ticket' });
    }
    if (application.status !== 'approved') {
      return res.status(400).json({ message: 'Application not yet approved' });
    }

    await generateHallTicketPDF(application, res);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate hall ticket', error: error.message });
  }
};

const approveApplication = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('exam');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    await createNotification(
      application.student,
      `Application ${status}`,
      `Your application for "${application.exam.title}" has been ${status}.`,
      'exam',
      true // also send email
    );

    await logAction(
      req.user.id,
      `APPLICATION_${status.toUpperCase()}`,
      'Application',
      application._id,
      `Application for exam "${application.exam.title}" was ${status}`
    );

    res.json({ message: `Application ${status}`, application });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update application', error: error.message });
  }
};

const allocateSeats = async (req, res) => {
  try {
    const { examId } = req.body;

    const approvedApps = await Application.find({
      exam: examId,
      status: 'approved',
      paymentStatus: 'paid',
    }).sort({ createdAt: 1 }); // FCFS allocation order

    const centers = await Center.find().sort({ name: 1 });

    if (centers.length === 0) {
      return res.status(400).json({ message: 'No exam centers available. Add centers first.' });
    }

    let centerIndex = 0;
    let seatCounter = 1;

    for (const app of approvedApps) {
      const currentCenter = centers[centerIndex];

      app.center = currentCenter._id;
      app.seatNumber = `${currentCenter.name.substring(0, 3).toUpperCase()}-${String(seatCounter).padStart(3, '0')}`;
      await app.save();

      seatCounter++;

      // Move to next center once current one hits capacity
      if (seatCounter > currentCenter.capacity) {
        centerIndex++;
        seatCounter = 1;

        if (centerIndex >= centers.length) {
          // Ran out of center capacity — remaining apps stay unallocated
          break;
        }
      }
    }

    res.json({ message: `Seats allocated for ${approvedApps.length} applications` });
  } catch (error) {
    res.status(500).json({ message: 'Seat allocation failed', error: error.message });
  }
};

module.exports = {
  applyToExam, getMyApplications, createPaymentOrder, verifyPayment,
  downloadHallTicket, approveApplication, allocateSeats,
};