# WorkForce Connect — Frontend Web Application

The frontend user interface for **WorkForce Connect**, built with React, Vite, Tailwind CSS, and Axios.

---

## Technical Stack

- **Framework**: React (v18+) with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios (with JWT interceptors and refresh token support)
- **Routing**: React Router (v6+)

---

## Directory Structure

```
frontend/
├── public/              # Static public assets
├── src/
│   ├── api/             # Axios API client and endpoints
│   ├── components/      # UI components (modals, forms, navigation)
│   ├── context/         # React Contexts (AuthContext, SocketContext)
│   ├── layouts/         # Layout wrappers for Admin, Employer, Worker dashboards
│   ├── pages/           # Application views and page components
│   ├── utils/           # Helper functions and formatters
│   ├── App.jsx          # Router configuration and application root
│   └── main.jsx         # Application entry point
├── package.json         # Dependencies and scripts
├── .env.example         # Template for environment variables
├── vite.config.js       # Vite build & dev proxy configuration
└── README.md            # Frontend documentation
```

---

## Environment Setup

Create a `.env` file in the `frontend/` directory based on `.env.example`:

```ini
# Base URL for API requests (defaults to /api when using dev proxy)
VITE_API_BASE_URL=/api

# Backend API server URL for Vite development proxy
VITE_BACKEND_URL=http://localhost:5000
```

---

## Available Scripts

In the `frontend/` directory, you can run:

### `npm run dev`
Runs the application in development mode with Hot Module Replacement (HMR).  
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`
Builds the app for production to the `dist/` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run preview`
Locally previews the production build created in the `dist/` folder.

---

## Integration with Backend API

All API requests are handled by `frontend/src/api/client.js`.
- Automatically attaches JWT Bearer tokens stored in `localStorage` (`wfc_access`).
- Automatically intercepts 401 Unauthorized responses to perform silent token refresh via `/api/auth/refresh`.
