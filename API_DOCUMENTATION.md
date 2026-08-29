# WorkForce Connect — REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 🔐 1. Authentication Endpoints (`/api/auth`)

### Register User
- **POST** `/auth/register`
- **Body**: `{ "email": "user@example.com", "password": "Password@123", "role": "worker|employer" }`

### Login User
- **POST** `/auth/login`
- **Body**: `{ "email": "user@example.com", "password": "Password@123" }`
- **Response**: `{ "token": "JWT_ACCESS_TOKEN", "user": { "id": 1, "email": "...", "role": "..." } }`

### Refresh Token
- **POST** `/auth/refresh`
- **Response**: `{ "token": "NEW_JWT_ACCESS_TOKEN" }`

---

## 👷 2. Worker Endpoints (`/api/worker`)
*Header: `Authorization: Bearer <TOKEN>`*

### Get Worker Profile
- **GET** `/worker/profile`

### Update Worker Profile
- **PUT** `/worker/profile`
- **Body**: `{ "firstName": "Ramesh", "lastName": "Kumar", "city": "Mumbai", "expectedSalary": 25000, "yearsExperience": 5 }`

### Search Jobs
- **GET** `/worker/jobs?q=welder&city=Mumbai&page=1`

### Apply for Job
- **POST** `/worker/jobs/:jobId/apply`
- **Body**: `{ "coverNote": "Experienced welder available immediately." }`

### Save Job
- **POST** `/worker/jobs/:jobId/save`

---

## 🏢 3. Employer Endpoints (`/api/employer`)
*Header: `Authorization: Bearer <TOKEN>`*

### Get Company Profile
- **GET** `/employer/company`

### Post New Job
- **POST** `/employer/jobs`
- **Body**: `{ "title": "CNC Operator", "salaryMin": 20000, "salaryMax": 30000, "city": "Pune", "vacancies": 10, "recruiterEmail": "recruiter@company.com" }`
- **Note**: Pass `recruiterEmail` to assign the job to a specific recruiter. All applications for this job will automatically go to that recruiter.

### Assign Recruiter to Job
- **PATCH** `/employer/jobs/:id`
- **Body**: `{ "recruiterEmail": "recruiter@company.com" }`
- **Note**: You can also use `recruiterId` (numeric ID) instead of email for backward compatibility.

### Manage Applicants
- **GET** `/employer/applications`
- **PUT** `/employer/applications/:id/status` `{ "status": "shortlisted|rejected|selected" }`
- **PATCH** `/employer/applications/:id/recruiter` `{ "recruiterEmail": "recruiter@company.com" }`
- **Note**: You can reassign applications to a different recruiter by email or ID.

### Schedule Interview
- **POST** `/employer/applications/:id/interview` `{ "scheduledAt": "2026-09-10T10:00:00Z", "location": "Pune Plant" }`

### Invite Recruiter
- **POST** `/employer/recruiters/invite` `{ "email": "recruiter@company.com", "fullName": "Suresh Sharma" }`

---

## 🛡️ 4. Admin Endpoints (`/api/admin`)
*Header: `Authorization: Bearer <TOKEN>` (Admin Role)*

### Get System Overview Stats
- **GET** `/admin/stats`

### Manage Companies
- **GET** `/admin/companies`
- **PUT** `/admin/companies/:id/status` `{ "status": "approved|suspended" }`

### Certificate Verification Queue
- **GET** `/admin/verification-requests`
- **PUT** `/admin/verification-requests/:id` `{ "status": "approved|rejected" }`

### Audit Logs & Reports
- **GET** `/admin/audit-logs`
- **GET** `/admin/complaints`
