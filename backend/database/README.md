# WorkForce Connect — Database Documentation

This directory contains the complete database schema DDL, seed data SQL script, and database setup instructions for **WorkForce Connect**.

## Database Overview

- **Database Engine**: MySQL / MariaDB (>= 8.0 / 10.4)
- **Database Name**: `workforce_connect`
- **Charset & Collation**: `utf8mb4` / `utf8mb4_unicode_ci`

---

## File Structure

```
backend/database/
├── schema.sql      # Complete database structure (25 tables, FKs, indexes, constraints)
├── seed.sql        # Master data and sample records (Admin, Employer, Recruiter, Workers, Jobs, Applications)
└── README.md       # Database setup guide and reference
```

---

## Database Setup & Import Instructions

### Option 1: Using MySQL Command Line (CLI)

Run the following commands in order from the terminal:

```bash
# 1. Create database and import schema
mysql -u root -p < backend/database/schema.sql

# 2. Import seed data
mysql -u root -p workforce_connect < backend/database/seed.sql
```

### Option 2: Using phpMyAdmin or GUI Client (DBeaver / MySQL Workbench)

1. Open your MySQL client and open `backend/database/schema.sql`.
2. Execute `schema.sql` to create the `workforce_connect` database and all 25 tables.
3. Open `backend/database/seed.sql` and execute it to populate all default and sample records.

---

## Default Login Credentials

All passwords in `seed.sql` are securely hashed using `bcrypt`.

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@workforceconnect.com` | `Admin@123` | Platform Administrator |
| **Employer** | `owner.tatasteel@workforceconnect.com` | `Owner@123` | Company Owner / Employer |
| **Recruiter** | `recruiter1.tatasteel@workforceconnect.com` | `Recruiter@123` | HR Recruiter |
| **Worker** | `worker1@workforceconnect.com` | `Worker@123` | Job Applicant / Blue-collar Worker |

---

## Table Summary

- `users`: Authentication accounts (Admin, Employer, Recruiter, Worker).
- `companies`: Registered enterprise companies and verification statuses.
- `employers`: Company owner and administrator profile mappings.
- `recruiters`: Recruiter profiles linked to companies.
- `workers`: Skilled worker profiles, digital IDs, QR codes, and trust scores.
- `skills`: Master skills catalog across categories (Electrical, Construction, Logistics, Healthcare, etc.).
- `worker_skills`: Many-to-many junction table mapping workers to skills with proficiency ratings.
- `jobs`: Job postings with compensation, location, experience requirements, and benefits.
- `job_skills`: Junction table linking required skills to job postings.
- `applications`: Worker job applications with status tracking (`applied`, `shortlisted`, `interview_scheduled`, `selected`, `rejected`, `offer_sent`, `joined`).
- `certificates`: Skill certificates and trade accreditations.
- `interviews`: Scheduled and completed candidate interviews.
- `offers`: Formal job offer terms, salary, and joining dates.
- `notifications`: User notifications and alerts.
- `ratings`: Peer/Employer feedback ratings and reviews.
- `employment_history`: Worker past employment records.
- `verification_requests`: Document and account verification workflow requests.
- `company_documents`: Corporate registration (GST, PAN) upload references.
- `audit_logs`: Administrative actions and security audit trails.
- `complaints`: Grievance and support ticketing records.
- `saved_jobs`: Worker saved job bookmarks.
- `messages`: Direct messaging chat history between platform users.
- `recruiter_notes`: Private recruitment notes on candidates.
- `platform_settings`: System configurations and commission settings.
- `otps`: One-time password verification tokens.
