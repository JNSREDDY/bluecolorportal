import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/landing/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Forgot from './pages/auth/Forgot';
import Verify from './pages/auth/Verify';
import DashboardLayout from './layouts/DashboardLayout';

import WorkerHome from './pages/worker/Home';
import WorkerJobs from './pages/worker/Jobs';
import WorkerJobDetail from './pages/worker/JobDetail';
import WorkerApplications from './pages/worker/Applications';
import WorkerProfile from './pages/worker/Profile';
import WorkerIdentity from './pages/worker/Identity';
import WorkerSaved from './pages/worker/Saved';
import WorkerInterviews from './pages/worker/Interviews';
import WorkerOffers from './pages/worker/Offers';
import WorkerChat from './pages/worker/Chat';

import EmployerHome from './pages/employer/Home';
import EmployerJobs from './pages/employer/Jobs';
import EmployerApps from './pages/employer/Applications';
import EmployerRecruiters from './pages/employer/Recruiters';
import EmployerCompany from './pages/employer/Company';
import EmployerAnalytics from './pages/employer/Analytics';

import RecruiterHome from './pages/recruiter/Home';
import RecruiterPipeline from './pages/recruiter/Pipeline';
import RecruiterCandidates from './pages/recruiter/Candidates';

import AdminHome from './pages/admin/Home';
import AdminCompanies from './pages/admin/Companies';
import AdminUsers from './pages/admin/Users';
import AdminJobs from './pages/admin/Jobs';
import AdminVerify from './pages/admin/Verify';
import AdminReports from './pages/admin/Reports';

import PublicId from './pages/public/PublicId';

function Guard({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-amber-500 font-bold">
        Loading WorkForce Connect...
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'employer') return <Navigate to="/employer/dashboard" replace />;
    if (user.role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />;
    return <Navigate to="/worker/dashboard" replace />;
  }
  return children;
}

function RoleHome() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminHome />;
  if (user?.role === 'employer') return <EmployerHome />;
  if (user?.role === 'recruiter') return <RecruiterHome />;
  return <WorkerHome />;
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<Login defaultRole="admin" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/id/:digitalId" element={<PublicId />} />

      {/* Explicit Worker Routes */}
      <Route
        path="/worker"
        element={(
          <Guard roles={['worker']}>
            <DashboardLayout />
          </Guard>
        )}
      >
        <Route index element={<Navigate to="/worker/dashboard" replace />} />
        <Route path="dashboard" element={<WorkerHome />} />
        <Route path="profile" element={<WorkerProfile />} />
        <Route path="jobs" element={<WorkerJobs />} />
        <Route path="applications" element={<WorkerApplications />} />
      </Route>

      {/* Explicit Employer Routes */}
      <Route
        path="/employer"
        element={(
          <Guard roles={['employer']}>
            <DashboardLayout />
          </Guard>
        )}
      >
        <Route index element={<Navigate to="/employer/dashboard" replace />} />
        <Route path="dashboard" element={<EmployerHome />} />
        <Route path="jobs" element={<EmployerJobs />} />
        <Route path="recruiters" element={<EmployerRecruiters />} />
        <Route path="applications" element={<EmployerApps />} />
      </Route>

      {/* Explicit Recruiter Routes */}
      <Route
        path="/recruiter"
        element={(
          <Guard roles={['recruiter']}>
            <DashboardLayout />
          </Guard>
        )}
      >
        <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
        <Route path="dashboard" element={<RecruiterHome />} />
        <Route path="applications" element={<RecruiterPipeline />} />
        <Route path="candidates" element={<RecruiterCandidates />} />
        <Route path="interviews" element={<RecruiterPipeline />} />
      </Route>

      {/* Explicit Admin Routes */}
      <Route
        path="/admin"
        element={(
          <Guard roles={['admin']}>
            <DashboardLayout />
          </Guard>
        )}
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminHome />} />
        <Route path="workers" element={<AdminUsers />} />
        <Route path="employers" element={<AdminCompanies />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="analytics" element={<AdminReports />} />
      </Route>

      {/* Legacy / Unified App Workspace Routes */}
      <Route
        path="/app"
        element={(
          <Guard>
            <DashboardLayout />
          </Guard>
        )}
      >
        <Route index element={<RoleHome />} />
        <Route path="jobs" element={<WorkerJobs />} />
        <Route path="jobs/:id" element={<WorkerJobDetail />} />
        <Route path="applications" element={<Guard roles={['worker']}><WorkerApplications /></Guard>} />
        <Route path="profile" element={<Guard roles={['worker']}><WorkerProfile /></Guard>} />
        <Route path="identity" element={<Guard roles={['worker']}><WorkerIdentity /></Guard>} />
        <Route path="saved" element={<Guard roles={['worker']}><WorkerSaved /></Guard>} />
        <Route path="interviews" element={<WorkerInterviews />} />
        <Route path="offers" element={<Guard roles={['worker']}><WorkerOffers /></Guard>} />
        <Route path="chat" element={<WorkerChat />} />
        <Route path="company" element={<Guard roles={['employer']}><EmployerCompany /></Guard>} />
        <Route path="manage-jobs" element={<Guard roles={['employer', 'recruiter']}><EmployerJobs /></Guard>} />
        <Route path="pipeline" element={<Guard roles={['employer', 'recruiter']}><EmployerApps /></Guard>} />
        <Route path="recruiters" element={<Guard roles={['employer']}><EmployerRecruiters /></Guard>} />
        <Route path="analytics" element={<Guard roles={['employer']}><EmployerAnalytics /></Guard>} />
        <Route path="candidates" element={<Guard roles={['recruiter', 'employer']}><RecruiterCandidates /></Guard>} />
        <Route path="hiring" element={<Guard roles={['recruiter']}><RecruiterPipeline /></Guard>} />
        <Route path="messages" element={<Guard roles={['recruiter']}><WorkerChat /></Guard>} />
        <Route path="admin/companies" element={<Guard roles={['admin']}><AdminCompanies /></Guard>} />
        <Route path="admin/users" element={<Guard roles={['admin']}><AdminUsers /></Guard>} />
        <Route path="admin/jobs" element={<Guard roles={['admin']}><AdminJobs /></Guard>} />
        <Route path="admin/verify" element={<Guard roles={['admin']}><AdminVerify /></Guard>} />
        <Route path="admin/reports" element={<Guard roles={['admin']}><AdminReports /></Guard>} />
      </Route>

      {/* Fallback wildcard route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
