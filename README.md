# 🏥 HealthCare+ — Comprehensive Healthcare Management System

A full-stack, production-ready Healthcare Management System designed for modern clinics and hospitals. Built with React 18, TypeScript, Tailwind CSS, Vite, Node.js, Express, and MongoDB.

---

## ✨ Features

### 🌐 Public Patient Portal
- **Hero & Overview:** Dynamic introduction, clinical statistics, emergency contact channels, and department overviews.
- **Doctor Directory & Filtering:** Search doctors by name, degree, qualification, and medical specialization (Cardiology, Pediatrics, Dental Care, Dermatology, General Consultation, Laboratory Tests).
- **Doctor Profile Pages:** Full biographical details, experience metrics, available consultation days, and consultation hours with instant booking links.
- **Clinical Departments:** In-depth service guides and specialist matching.
- **Contact & Location:** Operating schedule, campus address, inquiry form with validation, and interactive hospital map layout.

### 👤 Patient Experience (`/dashboard`)
- **Authentication:** JWT-based signup and login with role management.
- **Appointment Booking Engine:**
  - Past-date prevention (cannot select expired dates).
  - Doctor slot conflict validation (prevents double bookings at the exact same hour).
  - Real-time selection of available time slots.
- **Appointment Tracking:** Filter appointments by status (*All*, *Pending*, *Confirmed*, *Completed*, *Cancelled*) with cancellation dialogs.
- **Profile Management:** Update personal contact details and profile information.

### 🛡️ Administrative Console (`/admin`)
- **Overview Dashboard:** Live counters for registered patients, medical specialists, total appointments, and booking status breakdowns.
- **Manage Doctors (CRUD):** Add new medical specialists, modify clinic schedules, update qualifications, and delete inactive entries.
- **Manage Patients:** Searchable directory of patient accounts and contact phone numbers.
- **Manage Appointments:** Clinic-wide schedule oversight to confirm pending appointments, mark completed visits, or cancel bookings.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React, Axios, React Router v6
- **Backend:** Node.js, Express, Mongoose (MongoDB ODM), JWT (`jsonwebtoken`), bcryptjs
- **Database:** MongoDB Atlas (with automatic in-memory store fallback)
- **Build Tools:** Vite, ESBuild, TypeScript Compiler (`tsc`)

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/healthcare-management-system.git
cd healthcare-management-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your details (optional if running in demo mode):
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
MONGO_URI=your_mongodb_connection_string
```

### 4. Seed sample data (optional)
```bash
npm run seed
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `admin@healthcareplus.com` | `admin123` | Full admin dashboard, doctors & appointment controls |
| **Patient** | `patient@healthcareplus.com` | `patient123` | Patient booking, consultation history & profile |

*(You can also click the quick-fill demo buttons on the `/login` page)*

---

## 📦 Building for Production

```bash
npm run build
npm start
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
