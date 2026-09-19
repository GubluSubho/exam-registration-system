# Online Exam Registration System

A full-stack MERN application for digital exam registration, built for [Course Name] — [Semester/Year].

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Recharts
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JWT with role-based access control (Student, Faculty, Admin, Super Admin)
- **Payments:** Razorpay (test mode)
- **PDF/QR:** pdfkit, qrcode
- **Email:** Nodemailer (Gmail SMTP)

## Features
- Multi-role authentication and authorization
- Exam creation and management (Admin)
- Student exam application with eligibility windows
- Razorpay fee payment with signature verification
- Auto-generated hall tickets (PDF with QR code)
- Exam center management and automatic seat allocation
- Faculty duty roster, attendance marking, marks entry
- Result publishing workflow
- In-app + email notifications
- Super Admin: manage admins, audit logs, system settings
- Admin analytics dashboard (charts, revenue, application stats)
- Input validation, rate limiting, and RBAC on all sensitive routes

## Project Structure

exam-registration-system/
├── client/ # React frontend (Vite)
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ └── api/
├── server/ # Express backend
│ ├── models/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ └── utils/


## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Razorpay test account
- Gmail account with an App Password (for email notifications)

### Backend Setup
```bash
cd server
npm install
cp .env.example .env   # then fill in your actual values
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
cp .env.example .env   # then fill in your actual values
npm run dev
```

### Seeding Demo Data
```bash
cd server
npm run seed
```
This creates demo accounts (password: `password123`) for Super Admin, Admin, Faculty, and 4 Students, along with sample exams, centers, and applications in various states.

## Environment Variables

See `server/.env.example` and `client/.env.example` for the full list of required variables.

## Roles & Demo Credentials (after seeding)
| Role | Email | Password |
|---|---|---|
| Super Admin | superadmin@test.com | password123 |
| Admin | admin@test.com | password123 |
| Faculty | faculty@test.com | password123 |
| Student | aditi@test.com | password123 |

## Known Limitations
- Free-tier MongoDB Atlas and hosting (Render/Vercel) may have cold-start delays
- `mongodb+srv://` connections may fail on networks that block DNS SRV lookups (some institutional/campus Wi-Fi) — use a standard (non-SRV) connection string as a fallback in that case
- Payment integration runs in Razorpay test mode only

## Author
Subhodip Paul — [B.Tech CSE, Semester 5]
