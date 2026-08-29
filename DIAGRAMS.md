# WorkForce Connect — System Architecture & Diagrams

---

## 1. Entity-Relationship (ER) Diagram (MySQL & Sequelize Schema)

```mermaid
erDiagram
    USERS ||--o| WORKERS : "has profile"
    USERS ||--o| EMPLOYERS : "owns company"
    USERS ||--o| RECRUITERS : "belongs to company"
    COMPANIES ||--o{ RECRUITERS : "employs"
    COMPANIES ||--o{ JOBS : "posts"
    RECRUITERS ||--o{ JOBS : "manages"
    WORKERS ||--o{ APPLICATIONS : "submits"
    JOBS ||--o{ APPLICATIONS : "receives"
    WORKERS ||--o{ CERTIFICATES : "holds"
    WORKERS ||--o{ WORKER_SKILLS : "possesses"
    SKILLS ||--o{ WORKER_SKILLS : "categorizes"
    JOBS ||--o{ JOB_SKILLS : "requires"
    SKILLS ||--o{ JOB_SKILLS : "defines"
    APPLICATIONS ||--o| INTERVIEWS : "schedules"
    WORKERS ||--o{ RATINGS : "receives"
    EMPLOYERS ||--o{ RATINGS : "gives"

    USERS {
        int id PK
        string email UK
        string password
        string role "worker | employer | recruiter | admin"
        boolean isEmailVerified
        boolean isActive
    }

    WORKERS {
        int id PK
        int userId FK
        string firstName
        string lastName
        string phone
        string digitalId UK
        int trustScore
        string city
        string state
        int expectedSalary
        int yearsExperience
        string qrCode
    }

    COMPANIES {
        int id PK
        string name
        string gst UK
        string pan UK
        string industry
        string verificationStatus "pending | approved | suspended"
    }

    JOBS {
        int id PK
        int companyId FK
        string title
        string city
        int salaryMin
        int salaryMax
        int vacancies
        string status "published | paused | closed"
    }

    APPLICATIONS {
        int id PK
        int jobId FK
        int workerId FK
        string status "applied | shortlisted | interview | offer_sent | joined"
    }

    INTERVIEWS {
        int id PK
        int applicationId FK
        datetime scheduledAt
        string location
        string status "scheduled | completed | cancelled"
    }
```

---

## 2. Use Case Diagram

```mermaid
graph TD
    subgraph "WorkForce Connect Hiring Ecosystem"
        UC1["Register & Create Digital ID Profile"]
        UC2["Search Jobs by Trade & Location"]
        UC3["Apply for Job Vacancy"]
        UC4["Download Printable AI Resume"]
        UC5["Post Job Vacancy"]
        UC6["Review Applicants & Shortlist"]
        UC7["Schedule In-Person/Virtual Interview"]
        UC8["Issue Digital Offer Letter"]
        UC9["Verify Worker Certificates & Trust Score"]
        UC10["Moderate Employers (Approve GST/PAN)"]
    end

    Worker(("Worker (Blue-Collar)")) --> UC1
    Worker --> UC2
    Worker --> UC3
    Worker --> UC4

    Employer(("Employer Company")) --> UC5
    Employer --> UC6
    Employer --> UC7
    Employer --> UC8

    Recruiter(("HR Recruiter")) --> UC6
    Recruiter --> UC7

    Admin(("Platform Admin")) --> UC9
    Admin --> UC10
```

---

## 3. Hiring Flow Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Worker
    participant Frontend
    participant BackendAPI
    actor Employer
    participant Database

    Worker->>Frontend: Search Jobs (e.g. Electrician in Mumbai)
    Frontend->>BackendAPI: GET /api/worker/jobs?q=Electrician&city=Mumbai
    BackendAPI->>Database: Query Published Jobs with Company Details
    Database-->>BackendAPI: Return Matching Jobs List
    BackendAPI-->>Frontend: Display Filtered Job Cards

    Worker->>Frontend: Click "Apply Now"
    Frontend->>BackendAPI: POST /api/worker/jobs/:jobId/apply
    BackendAPI->>Database: Insert Application Record (status = 'applied')
    Database-->>BackendAPI: Application Saved
    BackendAPI-->>Frontend: 201 Created ("Application Submitted")

    Employer->>Frontend: Login to Employer Dashboard
    Employer->>Frontend: Open Applicant Pipeline
    Frontend->>BackendAPI: GET /api/employer/applications
    BackendAPI-->>Frontend: Return Candidate Applications

    Employer->>Frontend: Click "Schedule Interview"
    Frontend->>BackendAPI: POST /api/employer/applications/:id/interview
    BackendAPI->>Database: Create Interview Entry & Update Status to 'interview'
    Database-->>BackendAPI: Record Updated
    BackendAPI-->>Frontend: Interview Scheduled (Notification Sent to Worker via Socket.io)

    Employer->>Frontend: Click "Issue Offer Letter"
    Frontend->>BackendAPI: PUT /api/employer/applications/:id/status { status: 'offer_sent' }
    BackendAPI->>Database: Update Status to 'offer_sent'
    BackendAPI-->>Frontend: Digital Offer Issued
```
