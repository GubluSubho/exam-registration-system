# API Endpoint Reference — Online Exam Registration System

Base URL: `http://localhost:5000/api` (development) / `https://your-app.onrender.com/api` (production)

All protected routes require header: `Authorization: Bearer <accessToken>`

---

## Auth Routes (`/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login, returns JWT tokens |
| GET | `/auth/me` | Authenticated | Get current user's profile |

## Exam Routes (`/exams`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/exams` | Authenticated | List all exams |
| GET | `/exams/:id` | Authenticated | Get single exam details |
| POST | `/exams` | Admin, Super Admin | Create a new exam |
| PUT | `/exams/:id` | Admin, Super Admin | Update an exam |
| DELETE | `/exams/:id` | Admin, Super Admin | Delete an exam |

## Application Routes (`/applications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/applications` | Student | Apply to an exam |
| GET | `/applications/my` | Student | List own applications |
| POST | `/applications/create-payment` | Student | Create Razorpay payment order |
| POST | `/applications/verify-payment` | Student | Verify payment signature |
| GET | `/applications/:id/hall-ticket` | Student | Download hall ticket PDF |
| PUT | `/applications/:id/status` | Admin, Super Admin | Approve/reject an application |
| POST | `/applications/allocate-seats` | Admin, Super Admin | Auto-allocate seats for an exam |

## Center Routes (`/centers`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/centers` | Authenticated | List all exam centers |
| POST | `/centers` | Admin, Super Admin | Create a new center |
| DELETE | `/centers/:id` | Admin, Super Admin | Delete a center |

## Analytics Routes (`/analytics`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/analytics/dashboard` | Admin, Super Admin | Get aggregated stats (students, exams, revenue, status breakdown) |

## Duty Routes (`/duties`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/duties` | Admin, Super Admin | Assign invigilation duty to faculty |
| GET | `/duties/my` | Faculty | List own assigned duties |
| GET | `/duties/attendance-list` | Faculty | Get students for a given exam/center |
| POST | `/duties/mark-attendance` | Faculty | Mark a student's attendance status |

## Result Routes (`/results`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/results/enter-marks` | Faculty | Enter/update marks for a student |
| POST | `/results/publish` | Admin, Super Admin | Publish results for an exam |
| POST | `/results/unpublish` | Admin, Super Admin | Unpublish results for an exam |
| GET | `/results/my` | Student | View own published results |

## Notification Routes (`/notifications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/notifications/my` | Authenticated | List own notifications |
| PUT | `/notifications/:id/read` | Authenticated | Mark a notification as read |
| POST | `/notifications/broadcast` | Admin, Super Admin | Broadcast a notification to a role or all users |

## Super Admin Routes (`/superadmin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/superadmin/admins` | Super Admin | List all admin accounts |
| POST | `/superadmin/admins` | Super Admin | Create a new admin account |
| PUT | `/superadmin/admins/:id/deactivate` | Super Admin | Deactivate an admin account |
| GET | `/superadmin/audit-logs` | Super Admin | View system audit logs |

## Settings Routes (`/settings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/settings` | Authenticated | Get current system settings |
| PUT | `/settings` | Super Admin | Update system settings |

## Health Check
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/health` | Public | Confirm server is running |

---

**Total: 30 endpoints across 10 route groups**, covering all 4 roles (Student, Faculty, Admin, Super Admin) and every one of the 12 originally-scoped modules.