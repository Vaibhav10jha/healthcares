# HealthCare+ — Healthcare Management System (Full-Stack)

A modern, responsive Healthcare Management Website designed for college/academic projects and production demonstrations. Built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB (with built-in resilient in-memory store fallback).

---

## 🌟 Key Features

### Public Website
- **Home Page**: Hero section ("Your Health, Our Priority"), comprehensive clinical services, "Why Choose Us", featured doctors directory with search and specialization filter, step-by-step "How It Works", verified patient testimonials, interactive FAQ, and contact banner.
- **About Page**: Mission, Vision, core values, clinical statistics (15,000+ patients, 50+ doctors, 98% satisfaction), and medical leadership.
- **Services Page**: 6 specialized medical departments: General Consultation, Cardiology, Dental Care, Pediatrics, Dermatology, Laboratory Tests.
- **Doctors Directory**: Real-time search by doctor name, qualification, and specialty filters.
- **Doctor Details Page**: Doctor bio, qualifications, experience, available consultation days, and consultation hours with 1-click booking.
- **Contact Page**: Clinic location details, operating hours, emergency contact, contact form with validation, and hospital map layout.
- **Footer**: Includes the educational demonstration disclaimer:
  > *"HealthCare+ is a demonstration project for educational purposes and does not provide medical diagnosis or treatment."*

### Patient Portal
- **JWT Authentication & Protected Routing**: Register, Login, Auto-login, and Session validation.
- **1-Click Demo Evaluation Fill**: Quick buttons on login page for instant grading/testing without typing credentials.
- **Patient Dashboard**: Upcoming appointment spotlight, consultation statistics, and quick navigation.
- **Appointment Booking**:
  - Validates against past dates (prevents booking yesterday or earlier).
  - Validates against duplicate doctor bookings for the exact same date & time slot.
  - Choose doctor, date, available time slot, and reason for consultation.
- **Appointment Management**: Filter by status (Pending, Confirmed, Completed, Cancelled) and cancel appointments with a confirmation modal.
- **Profile Settings**: Manage patient contact details.

### Admin Dashboard
- **Admin Metrics**: Total Doctors, Registered Patients, Total Appointments, Pending, Confirmed, Completed, and Cancelled stats.
- **Manage Doctors**: Add new medical specialists, edit consultation hours and profiles, and delete inactive records.
- **Manage Patients**: View all registered patient profiles and contact phone numbers.
- **Manage Appointments**: View all appointments across all patients and update status (`Confirm`, `Complete`, `Cancel`).

---

## 🔑 Demo Credentials (1-Click on Login Page)

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `admin@healthcareplus.com` | `admin123` | Full access to Admin Console, Doctor Roster & All Appointments |
| **Patient** | `patient@healthcareplus.com` | `patient123` | Patient dashboard, booking consultations, canceling visits |

*(You can also register a new patient account with any email at `/register`)*

---

## 🚀 Deployment Instructions

### 1. MongoDB Atlas Setup (Free Cloud Database)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (M0).
3. Under **Database Access**, create a database user (e.g., `healthcare_admin` with a password).
4. Under **Network Access**, add IP address `0.0.0.0/0` (allow access from anywhere).
5. Under **Database > Connect > Drivers**, copy your MongoDB Connection String:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/healthcare_db?retryWrites=true&w=majority
   ```

### 2. Backend Deployment on Render
1. Push this repository to GitHub.
2. Log in to [Render](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Set the following build and start configurations:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Configure Environment Variables in Render:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
   - `JWT_SECRET`: `your_super_secure_jwt_secret_key`
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/healthcare_db?retryWrites=true&w=majority`
6. Click **Deploy Web Service**.

### 3. Frontend Deployment on Vercel
1. Log in to [Vercel](https://vercel.com).
2. Import your GitHub repository.
3. In **Build and Output Settings**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set Environment Variable:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api`
5. Click **Deploy**.

---

## 🧪 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Seed initial sample doctors and admin (optional, built-in fallback also handles this)
npm run seed

# 3. Start full-stack dev server
npm run dev
```

Visit `http://localhost:3000` in your browser.
