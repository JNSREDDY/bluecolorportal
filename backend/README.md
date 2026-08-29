# WorkForce Connect — Backend REST API

The backend server and API layer for **WorkForce Connect**, an enterprise recruitment platform connecting blue-collar workers, employers, and recruiters.

---

## Technical Stack

- **Runtime**: Node.js (>= 18)
- **Framework**: Express.js
- **Database ORM**: Sequelize ORM with MySQL2 (`mysql2`)
- **Authentication**: JWT (Access & Refresh Tokens), `bcryptjs` password hashing, Cookie Parser
- **Real-Time Communication**: Socket.io
- **File Storage**: Multer (Local disk storage under `uploads/`) & Cloudinary integration
- **Security & Logging**: Helmet, Express Rate Limit, CORS, Winston, Morgan

---

## Directory Structure

```
backend/
├── src/
│   ├── config/          # Environment & database configuration (env.js, database.js)
│   ├── controllers/     # Express route handlers (Auth, Admin, Employer, Worker, Recruiter)
│   ├── middleware/      # Authentication, validation, audit, and upload middleware
│   ├── models/          # Sequelize models (User, Worker, Employer, Recruiter, Job, etc.)
│   ├── repositories/    # Database repository layer
│   ├── routes/          # Express route definitions
│   ├── seeders/         # Programmatic database seeders
│   ├── services/        # Business logic services
│   ├── sockets/         # Socket.io event handlers
│   ├── utils/           # Helper utilities (logger, mailer, tokens, apiError)
│   └── server.js        # Express application entry point
├── database/
│   ├── schema.sql       # Full database DDL schema (25 tables, FKs, indexes)
│   ├── seed.sql         # Seed data script with default admin and sample accounts
│   └── README.md        # Database setup and import instructions
├── uploads/             # Static file upload directory (resumes, documents, photos)
├── package.json         # Backend dependencies & scripts
├── .env.example         # Template for backend environment variables
└── README.md            # Backend documentation
```

---

## Environment Setup

Create a `.env` file in the `backend/` directory based on `.env.example`:

```ini
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=workforce_connect
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=super_secret_jwt_access_key
JWT_REFRESH_SECRET=super_secret_jwt_refresh_key
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECURE=false

ADMIN_EMAIL=admin@workforceconnect.com
ADMIN_PASSWORD=Admin@123
```

---

## Database Setup

1. Make sure MySQL server is running.
2. Import the schema and seed scripts:

```bash
# Import database structure
mysql -u root -p < database/schema.sql

# Import seed data (creates default admin & test accounts)
mysql -u root -p workforce_connect < database/seed.sql
```

---

## Available Scripts

In the `backend/` directory, you can run:

### `npm start`
Starts the Express server in production mode (`node src/server.js`).

### `npm run dev`
Starts the Express server with Nodemon hot reloading (`nodemon src/server.js`).

### `npm run seed`
Programmatically seeds initial database tables via Sequelize.

---

## Default Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@workforceconnect.com` | `Admin@123` |
| **Employer** | `owner.tatasteel@workforceconnect.com` | `Owner@123` |
| **Recruiter** | `recruiter1.tatasteel@workforceconnect.com` | `Recruiter@123` |
| **Worker** | `worker1@workforceconnect.com` | `Worker@123` |
