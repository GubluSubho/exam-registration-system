const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

const { generalLimiter } = require('./middleware/rateLimiter');
app.use('/api', generalLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const examRoutes = require('./routes/examRoutes');
app.use('/api/exams', examRoutes);

const applicationRoutes = require('./routes/applicationRoutes');
app.use('/api/applications', applicationRoutes);

const centerRoutes = require('./routes/centerRoutes');
app.use('/api/centers', centerRoutes);

const analyticsRoutes = require('./routes/analyticsRoutes');
app.use('/api/analytics', analyticsRoutes);

const dutyRoutes = require('./routes/dutyRoutes');
app.use('/api/duties', dutyRoutes);

const resultRoutes = require('./routes/resultRoutes');
app.use('/api/results', resultRoutes);

const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

const superAdminRoutes = require('./routes/superAdminRoutes');
app.use('/api/superadmin', superAdminRoutes);

const settingsRoutes = require('./routes/settingsRoutes');
app.use('/api/settings', settingsRoutes);

// Global error handler — catches anything not already handled in a controller's try/catch
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`));