# WorkForce Connect — Enterprise Blue-Collar Recruitment Platform

**WorkForce Connect** is a production-ready enterprise hiring ecosystem designed for India's blue-collar workforce. It connects skilled workers (electricians, welders, plumbers, drivers, technicians, carpenters, masons, machine operators) with top verified Indian employers and enterprise recruiters.

---

## 📁 Project Structure

```
WorkForceConnect/
│
├── frontend/
│   ├── src/                 # React application components, pages, layouts, and API clients
│   ├── public/              # Public assets and icons
│   ├── package.json         # Frontend dependencies and build scripts
│   ├── .env.example         # Frontend environment variable template
│   └── README.md            # Frontend development & build documentation
│
├── backend/
│   ├── src/                 # Node.js Express server, models, controllers, services, routes
│   ├── database/
│   │   ├── schema.sql       # Complete SQL DDL schema (25 tables, FKs, constraints, indexes)
│   │   ├── seed.sql         # SQL seed data (Admin, Employer, Recruiter, Workers, Jobs)
│   │   └── README.md        # Database import instructions and documentation
│   ├── uploads/             # Static uploaded assets (resumes, certificates, documents)
│   ├── package.json         # Backend dependencies and server scripts
│   ├── .env.example         # Backend environment variable template
│   └── README.md            # Backend REST API documentation
│
└── README.md                # Root project deployment and developer guide
```

---

## 🌟 Key Features

### 👤 Worker Module
- **Digital Identity Card & QR Profile**: Verified digital identity card with QR code scanning for fast employer verification.
- **Trust Score Algorithm**: Dynamic trust rating (0–100) based on verified skills, employer ratings, and work history.
- **AI Resume Generator**: Instant printable & downloadable professional blue-collar resume PDF.
- **Job Search & Filters**: Filter by trade, location/city, salary, shift type, accommodation, and daily wage options.
- **Application & Interview Tracker**: Real-time status updates from Applied → Shortlisted → Interview → Selected → Offer Sent → Joined.
- **Direct Recruiter Messaging**: In-app real-time candidate chat via Socket.io.

### 🏢 Employer Module
- **GST & PAN Verification**: Automated and admin-moderated company compliance verification.
- **Recruiter Management**: Invite HR recruiters with secure email onboarding links and manage team permissions.
- **Job Management**: Post, edit, pause, publish, and delete job openings with salary ranges and perks (PF, ESI, food, lodging).
- **Hiring Pipeline & Interview Scheduler**: Shortlist candidates, set interview dates/locations, and issue offer letters.
- **Analytics Dashboard**: Visual hiring velocity, monthly applications, and trade breakdown.

### 👔 Recruiter (HR) Module
- **Assigned Vacancies**: Focused dashboard for managing assigned company jobs.
- **Candidate Discovery**: Search blue-collar talent pool by trade, skills, city, and trust score.
- **Interview & Offer Management**: Streamlined candidate evaluation and offer letter generation.

### 🛡️ Platform Admin Module
- **Seeded Admin Access**: Default seed credentials (`admin@workforceconnect.com` / `Admin@123`).
- **Employer Moderation**: Approve, reject, or suspend company accounts.
- **Certificate Verification Queue**: Moderate worker skill certificates issued by NSDC / ITI / Skill India.
- **Fraud & Spam Detection**: Review complaints and system audit logs.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Vite, TailwindCSS, Framer Motion, React Router, Axios, React Hook Form, Recharts, Lucide Icons |
| **Backend** | Node.js, Express.js, JWT (Access + Refresh), `bcryptjs`, Multer, Socket.io, Express Validator, Helmet, CORS |
| **Database** | **MySQL** with **Sequelize ORM** |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (>= 18)
- MySQL Server (>= 8.0 or MariaDB >= 10.4)

---

### 1. Database Import

Run the SQL scripts in `backend/database/` to create the database schema and populate seed data:

```bash
# 1. Create database and tables
mysql -u root -p < backend/database/schema.sql

# 2. Populate default admin and sample data
mysql -u root -p workforce_connect < backend/database/seed.sql
```

---

### 2. Backend Setup & Run

1. Navigate to `backend/` and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create `.env` based on `.env.example`:
   ```env
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:5173
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=workforce_connect
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=workforce_connect_enterprise_secret_2026
   JWT_REFRESH_SECRET=workforce_connect_enterprise_refresh_secret_2026
   ADMIN_EMAIL=admin@workforceconnect.com
   ADMIN_PASSWORD=Admin@123
   ```

3. Start backend server:
   ```bash
   # Development mode with Nodemon
   npm run dev

   # Production mode
   npm start
   ```

---

### 3. Frontend Setup & Run

1. Navigate to `frontend/` and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create `.env` based on `.env.example`:
   ```env
   VITE_API_BASE_URL=/api
   VITE_BACKEND_URL=http://localhost:5000
   ```

3. Start development server or build for production:
   ```bash
   # Development server
   npm run dev

   # Production build
   npm run build
   ```

---

## 🔑 Default Login Credentials

All passwords are securely hashed using `bcrypt` in `seed.sql`.

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Platform Admin** | `admin@workforceconnect.com` | `Admin@123` | Platform Administrator |
| **Employer (Tata Steel)** | `owner.tatasteel@workforceconnect.com` | `Owner@123` | Enterprise Employer Owner |
| **HR Recruiter** | `recruiter1.tatasteel@workforceconnect.com` | `Recruiter@123` | Enterprise Recruiter |
| **Worker (Electrician)** | `worker1@workforceconnect.com` | `Worker@123` | Blue-collar Job Applicant |

---

## 🌐 Production Deployment Steps

1. **Database Deployment**: Import `backend/database/schema.sql` followed by `backend/database/seed.sql` on your managed MySQL database instance (e.g. AWS RDS, DigitalOcean Managed Database).
2. **Backend Service**:
   - Set environment variables (`NODE_ENV=production`, `CLIENT_URL`, `DB_*`, `JWT_SECRET`, etc.).
   - Deploy Node.js server via Docker, PM2, AWS App Runner, or Render.
3. **Frontend Static Host**:
   - Build frontend assets using `npm run build`.
   - Host `dist/` bundle on Nginx, Vercel, Netlify, or AWS CloudFront/S3.
