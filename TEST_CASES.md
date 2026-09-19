# Test Case Document — Online Exam Registration System

Legend: **Pass** / **Fail** / **Blocked** (network) / **Not Yet Run**

---

## Module 1: Authentication

| ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-01 | Register with valid data | POST /auth/register with valid name/email/password | 201, user created | Pass |
| TC-02 | Register with duplicate email | Register same email twice | 400, "Email already registered" | Not Yet Run |
| TC-03 | Register with invalid email format | Register with "notanemail" | 400, validation error | Not Yet Run |
| TC-04 | Register with short password | Register with password < 6 chars | 400, validation error | Not Yet Run |
| TC-05 | Login with correct credentials | POST /auth/login | 200, accessToken + refreshToken returned | Pass |
| TC-06 | Login with wrong password | POST /auth/login with bad password | 401, "Invalid credentials" | Not Yet Run |
| TC-07 | Access /auth/me without token | GET /auth/me, no Authorization header | 401, "No token provided" | Not Yet Run |
| TC-08 | Access /auth/me with expired token | Use an expired JWT | 401, redirect to login (frontend) | Not Yet Run |
| TC-09 | Rate limit on login | 11 failed login attempts within 15 min | 429 on 11th attempt | Not Yet Run |

## Module 2: Exam Management

| ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-10 | Admin creates exam with valid dates | POST /exams as admin | 201, exam created | Not Yet Run |
| TC-11 | Student attempts to create exam | POST /exams as student | 403, access denied | Not Yet Run |
| TC-12 | Create exam with end date before start date | applicationEndDate < applicationStartDate | 400, validation error | Not Yet Run |
| TC-13 | Create exam with exam date before application end | examDate < applicationEndDate | 400, validation error | Not Yet Run |
| TC-14 | List all exams | GET /exams as any authenticated role | 200, array of exams | Not Yet Run |

## Module 3: Student Application & Payment

| ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-15 | Apply to an open exam | POST /applications with valid examId | 201, application created | Not Yet Run |
| TC-16 | Apply to same exam twice | Repeat TC-15 | 400, "already applied" | Not Yet Run |
| TC-17 | Apply outside application window | Apply after applicationEndDate | 400, "window is closed" | Not Yet Run |
| TC-18 | Create Razorpay payment order | POST /applications/create-payment | 200, order object returned | Not Yet Run |
| TC-19 | Verify payment with valid signature | Complete Razorpay test checkout | 200, paymentStatus updated to 'paid' | Not Yet Run |
| TC-20 | Verify payment with tampered signature | Send incorrect signature manually | 400, "verification failed" | Not Yet Run |
| TC-21 | Download hall ticket before approval | GET hall-ticket on pending application | 400, "not yet approved" | Not Yet Run |
| TC-22 | Download hall ticket before payment | GET hall-ticket on unpaid application | 400, "complete payment" | Not Yet Run |
| TC-23 | Download hall ticket after paid+approved | Full flow completion | 200, PDF with QR downloads | Not Yet Run |

## Module 4: Centers & Seat Allocation

| ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-24 | Admin creates a center | POST /centers | 201, center created | Not Yet Run |
| TC-25 | Allocate seats with no centers created | POST /allocate-seats, zero centers exist | 400, "add centers first" | Not Yet Run |
| TC-26 | Allocate seats exceeding one center's capacity | More approved+paid apps than capacity | Overflow apps assigned to next center | Not Yet Run |
| TC-27 | Allocate seats exceeding all centers' total capacity | More apps than total capacity | Remaining apps stay unallocated (no crash) | Not Yet Run |

## Module 5: Faculty — Duty, Attendance, Marks

| ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-28 | Admin assigns duty to faculty | POST /duties | 201, duty created | Not Yet Run |
| TC-29 | Faculty views own duties | GET /duties/my | 200, list of assigned duties only | Not Yet Run |
| TC-30 | Mark student present/absent/UFM | POST /duties/mark-attendance | 200, attendanceStatus updated | Not Yet Run |
| TC-31 | Enter marks exceeding max marks | marksObtained > maxMarks | 400, validation error | Not Yet Run |
| TC-32 | Enter marks below pass percentage | e.g. 30/100 | passStatus = 'fail', correct grade | Not Yet Run |
| TC-33 | Re-enter marks for same student/exam | Call enter-marks twice | Upserts, doesn't duplicate | Not Yet Run |

## Module 6: Results

| ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-34 | Student views results before publish | GET /results/my, published: false | Empty list (not shown) | Not Yet Run |
| TC-35 | Admin publishes results | POST /results/publish | All results for exam set published: true | Not Yet Run |
| TC-36 | Student views results after publish | GET /results/my | Result now visible | Not Yet Run |

## Module 7: Notifications

| ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-37 | Application approval triggers notification | Approve an application | Notification + email sent to student | Not Yet Run |
| TC-38 | Mark notification as read | PUT /notifications/:id/read | isRead becomes true | Not Yet Run |
| TC-39 | Admin broadcasts to all students | POST /notifications/broadcast, targetRole: student | All students receive notification | Not Yet Run |

## Module 8: Super Admin

| ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-40 | Super Admin creates new admin | POST /superadmin/admins | 201, admin created | Not Yet Run |
| TC-41 | Admin attempts to create another admin | POST /superadmin/admins as admin role | 403, access denied | Not Yet Run |
| TC-42 | Deactivate an admin | PUT /admins/:id/deactivate | isVerified set false | Not Yet Run |
| TC-43 | Sensitive action writes audit log | Approve an application | New AuditLog entry created | Not Yet Run |
| TC-44 | View audit logs | GET /audit-logs | 200, list sorted newest first | Not Yet Run |

## Module 9: RBAC / Route Protection (Cross-Cutting)

| ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-45 | Student navigates directly to /superadmin/admins URL | Type URL manually while logged in as student | Redirected to /unauthorized | Not Yet Run |
| TC-46 | Unauthenticated user navigates to /dashboard | No token, visit /dashboard | Redirected to /login | Not Yet Run |
| TC-47 | Visit an undefined route | Navigate to /this-does-not-exist | 404 page renders | Not Yet Run |

## Module 10: Environment / Infra

| ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-48 | Server starts with all env vars present | npm run dev | "Server running" + "MongoDB connected" | Pass (on home Wi-Fi) |
| TC-49 | Server behavior on blocked DNS SRV network | npm run dev on campus Wi-Fi | Connection fails; documented as known limitation | Blocked (confirmed issue) |
| TC-50 | Seed script populates all collections | npm run seed | Console confirms all 5 collections seeded | Blocked (network) |

---

## Summary
- **Total test cases documented:** 50
- **Executed and passing:** 3 (TC-01, TC-05, TC-48)
- **Blocked by network (campus Wi-Fi Atlas connectivity):** 2
- **Remaining to execute:** 45 — to be run once back on a working network

This table itself can go directly into your final report's "Testing" section, and doubles as your actual execution checklist for the next time you're on a connection that reaches Atlas.