const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const User = require('./models/User');
const Exam = require('./models/Exam');
const Center = require('./models/Center');
const Application = require('./models/Application');
const Settings = require('./models/Settings');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Exam.deleteMany({}),
      Center.deleteMany({}),
      Application.deleteMany({}),
      Settings.deleteMany({}),
    ]);
    console.log('Existing data cleared.');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Users
    const superAdmin = await User.create({
      name: 'Super Admin', email: 'superadmin@test.com', password: hashedPassword, role: 'superadmin',
    });
    const admin = await User.create({
      name: 'Admin User', email: 'admin@test.com', password: hashedPassword, role: 'admin',
    });
    const faculty = await User.create({
      name: 'Faculty Member', email: 'faculty@test.com', password: hashedPassword, role: 'faculty',
    });
    const students = await User.insertMany([
      { name: 'Aditi Sharma', email: 'aditi@test.com', password: hashedPassword, role: 'student' },
      { name: 'Rohan Verma', email: 'rohan@test.com', password: hashedPassword, role: 'student' },
      { name: 'Priya Das', email: 'priya@test.com', password: hashedPassword, role: 'student' },
      { name: 'Subhodip Paul', email: 'subhodip@test.com', password: hashedPassword, role: 'student' },
    ]);
    console.log('Users created.');

    // Centers
    const centers = await Center.insertMany([
      { name: 'Main Campus Hall A', address: '123 University Rd, Bhatpara', capacity: 2, facilities: ['CCTV', 'AC'] },
      { name: 'Main Campus Hall B', address: '123 University Rd, Bhatpara', capacity: 2, facilities: ['CCTV'] },
    ]);
    console.log('Centers created.');

    // Exams
    const now = new Date();
    const exam1 = await Exam.create({
      title: 'Data Structures & Algorithms — Mid Sem',
      description: 'Covers arrays, linked lists, trees, and basic graph algorithms.',
      subject: 'CS301',
      examDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // +20 days
      applicationStartDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // -5 days
      applicationEndDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // +10 days
      fee: 500,
      status: 'published',
      createdBy: admin._id,
    });
    const exam2 = await Exam.create({
      title: 'Database Management Systems — Mid Sem',
      description: 'Covers ER modeling, normalization, SQL, and transactions.',
      subject: 'CS302',
      examDate: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000),
      applicationStartDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      applicationEndDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      fee: 500,
      status: 'published',
      createdBy: admin._id,
    });
    console.log('Exams created.');

    // Applications — a spread of states so the demo shows every status
    await Application.create({
      exam: exam1._id, student: students[0]._id, status: 'approved', paymentStatus: 'paid',
    });
    await Application.create({
      exam: exam1._id, student: students[1]._id, status: 'pending', paymentStatus: 'unpaid',
    });
    await Application.create({
      exam: exam2._id, student: students[2]._id, status: 'approved', paymentStatus: 'paid',
    });
    await Application.create({
      exam: exam2._id, student: students[3]._id, status: 'rejected', paymentStatus: 'unpaid',
    });
    console.log('Applications created.');

    // Default settings
    await Settings.create({
      institutionName: 'Demo Institute of Technology',
      supportEmail: 'support@demo-institute.edu',
      lateFeeAmount: 100,
      reEvaluationFee: 200,
      updatedBy: superAdmin._id,
    });
    console.log('Settings created.');

    console.log('\n✅ Seeding complete!\n');
    console.log('Login credentials (all use password: password123):');
    console.log('  Super Admin: superadmin@test.com');
    console.log('  Admin:       admin@test.com');
    console.log('  Faculty:     faculty@test.com');
    console.log('  Students:    aditi@test.com, rohan@test.com, priya@test.com, subhodip@test.com');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();