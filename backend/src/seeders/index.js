require('dotenv').config();
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const env = require('../config/env');
const {
  sequelize, User, Company, Employer, Recruiter, Worker, Skill, WorkerSkill, Job, JobSkill,
  Application, Certificate, Rating, EmploymentHistory, Interview, Offer, Notification,
  VerificationRequest, CompanyDocument, PlatformSetting, Complaint, AuditLog,
} = require('../models');
const logger = require('../utils/logger');

const firstNames = [
  'Ramesh', 'Suresh', 'Amit', 'Priya', 'Kavita', 'Sunil', 'Deepak', 'Anjali', 'Vikram', 'Pooja',
  'Rahul', 'Neha', 'Manoj', 'Lakshmi', 'Arjun', 'Meena', 'Sanjay', 'Rekha', 'Imran', 'Fatima',
  'Harish', 'Geeta', 'Naveen', 'Sita', 'Kiran', 'Ravi', 'Ankit', 'Divya', 'Gopal', 'Asha',
];
const lastNames = [
  'Kumar', 'Sharma', 'Patel', 'Yadav', 'Singh', 'Reddy', 'Nair', 'Das', 'Khan', 'Verma',
  'Gupta', 'Joshi', 'Mishra', 'Iyer', 'Chauhan', 'Naik', 'Pillai', 'Bose', 'Shetty', 'Meena',
];
const cities = ['Mumbai', 'Pune', 'Chennai', 'Bengaluru', 'Hyderabad', 'Delhi', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Nagpur', 'Surat', 'Coimbatore'];
const states = {
  Mumbai: 'Maharashtra', Pune: 'Maharashtra', Nagpur: 'Maharashtra', Surat: 'Gujarat', Ahmedabad: 'Gujarat',
  Chennai: 'Tamil Nadu', Coimbatore: 'Tamil Nadu', Bengaluru: 'Karnataka', Hyderabad: 'Telangana',
  Delhi: 'Delhi', Jaipur: 'Rajasthan', Kolkata: 'West Bengal',
};
const trades = [
  'Electrician', 'Plumber', 'Driver', 'Machine Operator', 'Welder', 'Helper', 'Technician',
  'Delivery Executive', 'Carpenter', 'Mason',
];
const skillCatalog = [
  { name: 'House Wiring', category: 'Electrical' },
  { name: 'Industrial Electrical', category: 'Electrical' },
  { name: 'Plumbing', category: 'Construction' },
  { name: 'Pipe Fitting', category: 'Construction' },
  { name: 'Heavy Vehicle Driving', category: 'Logistics' },
  { name: 'LMV Driving', category: 'Logistics' },
  { name: 'CNC Operation', category: 'Manufacturing' },
  { name: 'Welding MIG', category: 'Manufacturing' },
  { name: 'Welding TIG', category: 'Manufacturing' },
  { name: 'Masonry', category: 'Construction' },
  { name: 'Carpentry', category: 'Construction' },
  { name: 'HVAC', category: 'Facilities' },
  { name: 'Forklift', category: 'Logistics' },
  { name: 'Warehouse Picking', category: 'Logistics' },
  { name: 'Patient Care Support', category: 'Healthcare' },
];
const companiesSeed = [
  { name: 'Tata Steel', industry: 'Steel', city: 'Jamshedpur', state: 'Jharkhand', gst: '20AABCT1234A1Z1', pan: 'AABCT1234A', website: 'https://www.tatasteel.com' },
  { name: 'L&T Construction', industry: 'Construction', city: 'Mumbai', state: 'Maharashtra', gst: '27AAACL5678B1Z2', pan: 'AAACL5678B', website: 'https://www.larsentoubro.com' },
  { name: 'Ashok Leyland', industry: 'Automotive', city: 'Chennai', state: 'Tamil Nadu', gst: '33AAACA9012C1Z3', pan: 'AAACA9012C', website: 'https://www.ashokleyland.com' },
  { name: 'Mahindra Logistics', industry: 'Logistics', city: 'Pune', state: 'Maharashtra', gst: '27AAACM3456D1Z4', pan: 'AAACM3456D', website: 'https://www.mahindralogistics.com' },
  { name: 'UltraTech Cement', industry: 'Cement', city: 'Mumbai', state: 'Maharashtra', gst: '27AAACU7890E1Z5', pan: 'AAACU7890E', website: 'https://www.ultratechcement.com' },
  { name: 'JSW Steel', industry: 'Steel', city: 'Mumbai', state: 'Maharashtra', gst: '27AAACJ2345F1Z6', pan: 'AAACJ2345F', website: 'https://www.jsw.in' },
  { name: 'BHEL', industry: 'Engineering', city: 'New Delhi', state: 'Delhi', gst: '07AAACB6789G1Z7', pan: 'AAACB6789G', website: 'https://www.bhel.com' },
  { name: 'Apollo Hospitals', industry: 'Healthcare', city: 'Chennai', state: 'Tamil Nadu', gst: '33AAACA1122H1Z8', pan: 'AAACA1122H', website: 'https://www.apollohospitals.com' },
  { name: 'Amazon Logistics', industry: 'Logistics', city: 'Bengaluru', state: 'Karnataka', gst: '29AAACA3344I1Z9', pan: 'AAACA3344I', website: 'https://www.amazon.in' },
  { name: 'Flipkart Supply Chain', industry: 'Logistics', city: 'Bengaluru', state: 'Karnataka', gst: '29AAACF5566J1Z0', pan: 'AAACF5566J', website: 'https://www.flipkart.com' },
];

const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 18);
const pick = (arr, i) => arr[i % arr.length];
const rand = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

const jobTitlesFor = (company, i) => {
  const map = {
    'Tata Steel': ['Furnace Operator', 'Welder', 'Electrical Technician', 'Safety Steward', 'Crane Operator'],
    'L&T Construction': ['Mason', 'Carpenter', 'Site Helper', 'Bar Bender', 'Electrician'],
    'Ashok Leyland': ['Assembly Line Operator', 'Welder', 'Quality Inspector', 'Painter', 'Machine Operator'],
    'Mahindra Logistics': ['Heavy Driver', 'Warehouse Picker', 'Loader', 'Route Supervisor', 'Delivery Executive'],
    'UltraTech Cement': ['Plant Helper', 'Packing Operator', 'Electrician', 'Fitter', 'Security Guard'],
    'JSW Steel': ['Mill Operator', 'Welder', 'Maintenance Technician', 'Helper', 'Electrician'],
    'BHEL': ['Fitter', 'Welder', 'Technician', 'Electrician', 'Store Keeper'],
    'Apollo Hospitals': ['Ward Helper', 'Housekeeping Staff', 'Ambulance Driver', 'Technician', 'Patient Care'],
    'Amazon Logistics': ['Delivery Executive', 'Sorter', 'Warehouse Associate', 'Loader', 'LMV Driver'],
    'Flipkart Supply Chain': ['Delivery Executive', 'Picker', 'Packer', 'Hub Loader', 'Hub Driver'],
  };
  const titles = map[company] || ['Technician'];
  return `${titles[i % titles.length]}${i >= titles.length ? ` ${Math.floor(i / titles.length) + 1}` : ''}`;
};

async function seed() {
  const mysql = require('mysql2/promise');
  const conn = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
  });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${env.db.name}\`;`);
  await conn.end();

  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  logger.info('Database reset. Seeding...');

  const hash = {
    admin: await bcrypt.hash(env.admin.password, 10),
    owner: await bcrypt.hash('Owner@123', 10),
    rec: await bcrypt.hash('Recruiter@123', 10),
    worker: await bcrypt.hash('Worker@123', 10),
  };

  const admin = await User.create({
    email: env.admin.email,
    password: hash.admin,
    role: 'admin',
    isEmailVerified: true,
    isActive: true,
  });

  await PlatformSetting.bulkCreate([
    { key: 'platform_name', value: 'WorkForce Connect' },
    { key: 'support_email', value: 'support@workforceconnect.com' },
    { key: 'commission_percent', value: '8' },
  ]);

  await Skill.bulkCreate(skillCatalog);
  const skills = await Skill.findAll();

  const companyRows = [];
  const allJobs = [];
  const recruiters = [];

  for (const c of companiesSeed) {
    const company = await Company.create({
      ...c,
      address: `${rand(10, 99)} Industrial Area`,
      pincode: String(rand(400001, 600099)),
      employeeCount: rand(500, 40000),
      verificationStatus: 'approved',
      description: `${c.name} hires skilled blue-collar talent through WorkForce Connect.`,
    });
    companyRows.push(company);

    await CompanyDocument.create({
      companyId: company.id, type: 'gst', fileUrl: '/uploads/sample-gst.pdf', verified: true,
    });

    const ownerUser = await User.create({
      email: `owner.${slug(c.name)}@workforceconnect.com`,
      password: hash.owner,
      role: 'employer',
      isEmailVerified: true,
    });
    await Employer.create({
      userId: ownerUser.id,
      companyId: company.id,
      isOwner: true,
      designation: 'Owner',
      fullName: `${c.name} Owner`,
      phone: `98${rand(10000000, 99999999)}`,
    });
    await VerificationRequest.create({
      userId: ownerUser.id, type: 'employer', entityId: company.id, status: 'approved', reviewedBy: admin.id,
    });

    for (let r = 1; r <= 2; r += 1) {
      const ru = await User.create({
        email: `recruiter${r}.${slug(c.name)}@workforceconnect.com`,
        password: hash.rec,
        role: 'recruiter',
        isEmailVerified: true,
      });
      const rec = await Recruiter.create({
        userId: ru.id,
        companyId: company.id,
        invitedBy: ownerUser.id,
        designation: r === 1 ? 'HR Lead' : 'Recruiter',
        fullName: `${pick(firstNames, r)} ${pick(lastNames, r)}`,
        phone: `97${rand(10000000, 99999999)}`,
        status: 'active',
      });
      recruiters.push(rec);
    }

    for (let j = 0; j < 15; j += 1) {
      const city = pick(cities, j + company.id);
      const job = await Job.create({
        companyId: company.id,
        postedBy: ownerUser.id,
        title: jobTitlesFor(c.name, j),
        description: `Join ${c.name} as ${jobTitlesFor(c.name, j)}. PPE provided. Weekly wages via bank. Safety training on day one.`,
        salaryMin: rand(14000, 18000),
        salaryMax: rand(19000, 32000),
        experienceMin: rand(0, 2),
        experienceMax: rand(4, 10),
        vacancies: rand(2, 25),
        location: `${city} Plant`,
        city,
        state: states[city] || 'Maharashtra',
        jobType: pick(['full_time', 'contract', 'daily_wage'], j),
        shift: pick(['day', 'night', 'rotational'], j),
        accommodation: j % 2 === 0,
        food: j % 3 === 0,
        benefits: 'PF, ESI, overtime, weekly off',
        deadline: new Date(Date.now() + rand(10, 60) * 86400000),
        status: j === 14 ? 'draft' : 'published',
      });
      const sId1 = skills[(j + Number(company.id)) % skills.length].id;
      const sId2 = skills[(j + 3) % skills.length].id;
      const uniqueSkillIds = Array.from(new Set([sId1, sId2]));
      await JobSkill.bulkCreate(uniqueSkillIds.map((skillId) => ({ jobId: job.id, skillId })));
      allJobs.push(job);
    }
  }

  const workers = [];
  for (let i = 0; i < 100; i += 1) {
    const trade = trades[i % trades.length];
    const fn = pick(firstNames, i);
    const ln = pick(lastNames, i + 3);
    const city = pick(cities, i);
    const user = await User.create({
      email: `worker${i + 1}@workforceconnect.com`,
      password: hash.worker,
      role: 'worker',
      isEmailVerified: true,
    });
    const digitalId = `WFC-${String(i + 1).padStart(8, '0')}`;
    const qrCode = await QRCode.toDataURL(`${env.clientUrl}/id/${digitalId}`);
    const worker = await Worker.create({
      userId: user.id,
      firstName: fn,
      lastName: ln,
      phone: `9${rand(100000000, 999999999)}`,
      city,
      state: states[city] || 'Maharashtra',
      pincode: String(rand(110001, 600099)),
      expectedSalary: rand(15000, 35000),
      preferredLocations: [city, pick(cities, i + 4)],
      availability: pick(['immediate', '15_days', '30_days'], i),
      languages: i % 2 === 0 ? ['Hindi', 'English'] : ['Hindi', 'Tamil'],
      education: pick(['8th Pass', '10th Pass', '12th Pass', 'ITI', 'Diploma'], i),
      yearsExperience: rand(1, 14),
      profileCompletion: rand(60, 98),
      trustScore: rand(55, 96),
      digitalId,
      qrCode,
      isVerified: i % 5 !== 0,
      gender: i % 4 === 0 ? 'female' : 'male',
      bio: `Experienced ${trade} seeking stable work with verified employers.`,
    });
    workers.push(worker);

    const wsId1 = skills[i % skills.length].id;
    const wsId2 = skills[(i + 2) % skills.length].id;
    const workerSkillItems = wsId1 === wsId2
      ? [{ workerId: worker.id, skillId: wsId1, proficiency: 'expert' }]
      : [
        { workerId: worker.id, skillId: wsId1, proficiency: 'expert' },
        { workerId: worker.id, skillId: wsId2, proficiency: 'intermediate' },
      ];
    await WorkerSkill.bulkCreate(workerSkillItems);

    await Certificate.create({
      workerId: worker.id,
      name: `${trade} Skill Certificate`,
      issuer: pick(['NSDC', 'ITI', 'Skill India', 'Company Training'], i),
      issuedAt: '2023-04-12',
      fileUrl: '/uploads/sample-cert.pdf',
      verified: i % 3 !== 0,
    });

    await EmploymentHistory.create({
      workerId: worker.id,
      companyName: pick(['Local Contractor', 'Metro Infra', 'City Logistics', 'Plant Services'], i),
      role: trade,
      startDate: '2021-01-01',
      endDate: i % 7 === 0 ? null : '2024-12-01',
      currentlyWorking: i % 7 === 0,
      description: 'On-site operations and safety compliance.',
    });

    const companyForRating = companyRows[i % companyRows.length];
    await Rating.create({
      workerId: worker.id,
      companyId: companyForRating.id,
      rating: [3.5, 4, 4.5, 5][i % 4],
      comment: 'Reliable and punctual.',
      type: 'employer_to_worker',
    });

    const job = allJobs[i % allJobs.length];
    const statuses = ['applied', 'shortlisted', 'interview_scheduled', 'selected', 'rejected', 'offer_sent', 'joined'];
    const app = await Application.create({
      jobId: job.id,
      workerId: worker.id,
      recruiterId: recruiters[i % recruiters.length].id,
      status: statuses[i % statuses.length],
      coverNote: `I am a ${trade} with ${worker.yearsExperience} years of experience.`,
    });

    if (['interview_scheduled', 'selected', 'offer_sent', 'joined'].includes(app.status)) {
      await Interview.create({
        applicationId: app.id,
        scheduledAt: new Date(Date.now() + rand(-5, 12) * 86400000),
        mode: 'in_person',
        location: `${job.city} office`,
        status: app.status === 'interview_scheduled' ? 'scheduled' : 'completed',
      });
    }
    if (['offer_sent', 'joined'].includes(app.status)) {
      await Offer.create({
        applicationId: app.id,
        salary: worker.expectedSalary,
        joiningDate: '2026-09-15',
        status: app.status === 'joined' ? 'accepted' : 'sent',
        terms: 'PF, ESI, 8 hour shift',
        letterUrl: 'Standard offer letter',
      });
    }

    await Notification.create({
      userId: user.id,
      title: 'Welcome to WorkForce Connect',
      message: 'Complete your profile to raise your trust score.',
      type: 'info',
    });
  }

  await Complaint.create({
    raisedBy: workers[0].userId,
    type: 'spam_job',
    description: 'Job poster asked for money before joining.',
    status: 'open',
  });

  await AuditLog.create({
    userId: admin.id,
    action: 'seed_database',
    entity: 'platform',
    metadata: { companies: 10, workers: 100, jobs: 150 },
  });

  logger.info('Seed complete');
  logger.info(`Admin: ${env.admin.email} / ${env.admin.password}`);
  logger.info('Employer sample: owner.tatasteel@workforceconnect.com / Owner@123');
  logger.info('Recruiter sample: recruiter1.tatasteel@workforceconnect.com / Recruiter@123');
  logger.info('Worker sample: worker1@workforceconnect.com / Worker@123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('SEED_FAIL:', err.message, err.parent ? err.parent.sqlMessage : '');
  logger.error(err);
  process.exit(1);
});
