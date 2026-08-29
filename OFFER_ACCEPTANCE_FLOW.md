# Offer Acceptance & Vacancy Management Implementation

## Overview
Complete implementation of the offer acceptance workflow where workers can accept job offers and vacancies automatically decrease in the employer dashboard.

## Workflow Flow

### 1. **Recruiter Sends Offer**
- Recruiter issues offer letter to candidate via "Take Worker / Offer" button
- `POST /recruiter/applications/:id/offer`
- Application status: `offer_sent`
- Offer record created with status: `sent`
- Job remains marked as "published" with vacancies unchanged

### 2. **Worker Receives & Accepts Offer**
- Worker navigates to "Employment Offer Letters" page
- Sees all received offers with salary, joining date, and terms
- Offer shows status: "Pending Offer Response"
- Two action buttons:
  - ✓ **Accept Offer & Join Company** (green button)
  - ✗ **Decline Offer** (red button)

### 3. **Worker Accepts Offer**
- `POST /worker/offers/:offerId/respond` with status: "accepted"
- Offer status: `accepted`
- Application status: `joined`
- **Automatically triggers: `syncJobFillStatus(jobId)`**

### 4. **Vacancy Count Updates**
The `syncJobFillStatus` function:
- Counts applications with status `joined` (only accepted offers)
- Formula: `acceptedCount >= totalVacancies`
- If all vacancies filled:
  - Job status → `closed`
  - Job no longer visible to new workers
  - Employer sees job marked as "FILLED"

### 5. **Employer Dashboard Updates**
Employer can see in real-time:
- **Vacancy Status**: Shows "X Open, Y Accepted / Z Total"
- **Job Status**: Button changes to "filled (closed)" when all positions accepted
- **Color Coding**: Green = published, Red = filled

### 6. **Worker Job Listing Updates**
- Jobs with status `closed` are automatically removed from worker search
- Workers see: "All posted positions have been filled or are currently closed"
- Message: "Check back later for new opportunities!"

---

## Technical Implementation Details

### Backend Changes

#### 1. **job.service.js**
```javascript
// Normalization function for vacancy counts
const normalizeVacancyCount = (value, fallback = 1) => {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.floor(parsed));
};

// Updated syncJobFillStatus - only counts JOINED applications
async syncJobFillStatus(jobId) {
  const job = await Job.findByPk(jobId);
  if (!job || job.status === 'closed') return job;
  
  // Count only accepted offers (joined status)
  const acceptedCount = await Application.count({
    where: {
      jobId,
      status: 'joined',  // Only count accepted offers
    },
  });
  
  if (job.vacancies > 0 && acceptedCount >= normalizeVacancyCount(job.vacancies, 1)) {
    job.status = 'closed';
    await job.save();
  }
  return job;
}

// Enhanced companyJobs - returns acceptedCount for each job
async companyJobs(userId, query) {
  // ... existing code ...
  const jobsWithStats = await Promise.all(
    jobs.map(async (job) => {
      const acceptedCount = await Application.count({
        where: {
          jobId: job.id,
          status: 'joined',
        },
      });
      return {
        ...job.toJSON(),
        acceptedCount,
      };
    })
  );
  return jobsWithStats;
}

// Filter published jobs with available vacancies
async publicSearch(query) {
  const where = { status: 'published', vacancies: { [Op.gt]: 0 } };
  // ... rest of implementation
}
```

#### 2. **application.service.js**
```javascript
// respondOffer - handles offer acceptance/decline
async respondOffer(userId, offerId, status) {
  const offer = await Offer.findByPk(offerId, { 
    include: [{ model: Application, include: [Worker] }] 
  });
  
  if (offer.Application.Worker.userId !== userId) 
    throw new ApiError(403, 'Not your offer');
  
  offer.status = status;
  await offer.save();
  
  if (status === 'accepted') {
    offer.Application.status = 'joined';  // Mark as joined
    await offer.Application.save();
    await jobService.syncJobFillStatus(offer.Application.jobId);  // Update job status
  }
  
  return offer;
}
```

### Frontend Changes

#### 1. **worker/Offers.jsx**
- Already implemented with full UI
- Shows pending offers with details
- Accept/Decline buttons for pending offers
- Shows accepted/declined status for completed offers
- `handleRespond()` calls backend API to accept/decline

#### 2. **employer/Jobs.jsx**
```javascript
// Enhanced job listing with real-time vacancy tracking
const fetchJobs = () => {
  api.get('/employer/jobs')
    .then((res) => {
      const jobsData = safeArray(res);
      setJobs(jobsData);
      
      // Build stats from API response
      const stats = {};
      jobsData.forEach((job) => {
        stats[job.id] = {
          accepted: job.acceptedCount || 0,
          total: job.vacancies || 1,
        };
      });
      setJobStats(stats);
    })
};

// Display in table
const remaining = Math.max(0, stats.total - stats.accepted);
const isClosed = remaining === 0 && stats.accepted > 0;

// Shows: "2 Open, 1 Accepted / 3 Total"
<div className="space-y-1">
  <div className="font-semibold text-amber-500">{remaining} Open</div>
  <div className="text-xs text-slate-400">
    {stats.accepted} Accepted / {stats.total} Total
  </div>
</div>
```

#### 3. **worker/Jobs.jsx**
- Filters out closed jobs and those with no vacancies
- Shows helpful message when no jobs available
- Only displays published jobs with `vacancies > 0`

#### 4. **recruiter/Pipeline.jsx**
- Added "Job Status" column showing if position is filled
- Displays total vacancies so recruiter knows limits
- Status indicator: "Open" vs "FILLED"

---

## Database Schema

### Offer Table
```sql
CREATE TABLE offers (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  applicationId INT UNSIGNED NOT NULL,
  salary INT NOT NULL,
  joiningDate DATE,
  letterUrl TEXT,
  status ENUM('sent', 'accepted', 'declined', 'expired') DEFAULT 'sent',
  terms TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Application Table
```sql
CREATE TABLE applications (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  jobId INT UNSIGNED NOT NULL,
  workerId INT UNSIGNED NOT NULL,
  recruiterId INT UNSIGNED,
  status ENUM('applied', 'shortlisted', 'interview_scheduled', 
              'interview_completed', 'selected', 'rejected', 
              'offer_sent', 'joined') DEFAULT 'applied',
  coverNote TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Job Table
```sql
ALTER TABLE jobs ADD COLUMN vacancies INT DEFAULT 1;
-- vacancies field already existed
```

---

## API Endpoints

### Worker Routes
```
POST   /worker/offers/:offerId/respond     - Accept/Decline offer
GET    /worker/offers                      - List all offers
GET    /worker/applications                - List applications
```

### Recruiter Routes
```
POST   /recruiter/applications/:id/offer   - Issue offer letter
GET    /recruiter/applications             - View pipeline
```

### Employer Routes
```
GET    /employer/jobs                      - List jobs with acceptedCount
GET    /employer/applications              - View all applications
```

---

## User Experience Flow

### For Workers
1. Applies for job
2. Recruiter shortlists and schedules interview
3. Recruiter issues offer
4. **Worker sees notification + Offers page shows pending offer**
5. **Worker clicks "Accept Offer & Join Company"**
6. Offer accepted, application marked as joined
7. **Vacancies for that job decrease**
8. If all positions filled, job disappears from job listings

### For Recruiters
1. Reviews applications in pipeline
2. Shortlists promising candidates
3. Schedules interviews
4. Issues job offers
5. **Sees job status column showing "Open" or "FILLED"**
6. **Knows exactly when all positions are filled**

### For Employers
1. Posts jobs with number of vacancies
2. **Real-time dashboard shows:**
   - Total vacancies posted
   - Number of accepted offers
   - Remaining open positions
   - Job marked "FILLED" when complete
3. Can toggle status or delete jobs

---

## Key Features

✅ **Vacancy Counting**: Only counts offers workers have accepted, not just sent offers  
✅ **Real-time Updates**: Frontend fetches accepted count with job data  
✅ **Automatic Closure**: Jobs auto-close when all vacancies filled  
✅ **Visibility Management**: Closed jobs disappear from worker search  
✅ **Clear Status**: Employers see "X Open, Y Accepted / Z Total"  
✅ **Recruiter Awareness**: Recruiters can see job fill status while assigning  
✅ **Worker Clarity**: Workers know their offer status and can accept/decline  

---

## Testing Checklist

- [ ] Worker receives offer notification
- [ ] Worker can see offer details (salary, joining date, terms)
- [ ] Worker clicks "Accept Offer" button
- [ ] Employer sees "Accepted" count increase
- [ ] When all vacancies accepted, employer sees "filled (closed)"
- [ ] Worker job listing no longer shows closed job
- [ ] Recruiter sees job status column update
- [ ] Multi-vacancy jobs show correct remaining count
- [ ] Accepting multiple offers works correctly
- [ ] Declining offer doesn't affect vacancy count
