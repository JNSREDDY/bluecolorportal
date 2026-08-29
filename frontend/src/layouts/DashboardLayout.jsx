import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiBriefcase, FiGrid, FiUsers, FiFileText, FiShield, FiStar, FiBell,
  FiLogOut, FiMoon, FiSun, FiHome, FiMessageCircle, FiBarChart2, FiCheckCircle,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

const links = {
  worker: [
    { to: '/worker/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/worker/jobs', label: 'Search Jobs', icon: FiBriefcase },
    { to: '/worker/applications', label: 'Applications', icon: FiFileText },
    { to: '/worker/profile', label: 'Profile', icon: FiUsers },
    { to: '/app/saved', label: 'Saved', icon: FiStar },
    { to: '/app/interviews', label: 'Interviews', icon: FiCheckCircle },
    { to: '/app/offers', label: 'Offers', icon: FiFileText },
    { to: '/app/identity', label: 'Digital ID', icon: FiShield },
    { to: '/app/chat', label: 'Messages', icon: FiMessageCircle },
  ],
  employer: [
    { to: '/employer/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/employer/jobs', label: 'Jobs', icon: FiBriefcase },
    { to: '/employer/applications', label: 'Applications', icon: FiFileText },
    { to: '/employer/recruiters', label: 'Recruiters', icon: FiUsers },
    { to: '/app/company', label: 'Company', icon: FiGrid },
    { to: '/app/candidates', label: 'Search Talent', icon: FiUsers },
    { to: '/app/analytics', label: 'Analytics', icon: FiBarChart2 },
  ],
  recruiter: [
    { to: '/recruiter/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/recruiter/applications', label: 'Applications', icon: FiFileText },
    { to: '/recruiter/candidates', label: 'Candidates', icon: FiUsers },
    { to: '/recruiter/interviews', label: 'Interviews', icon: FiCheckCircle },
    { to: '/app/manage-jobs', label: 'Assigned Jobs', icon: FiBriefcase },
    { to: '/app/messages', label: 'Messages', icon: FiMessageCircle },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/admin/employers', label: 'Employers', icon: FiGrid },
    { to: '/admin/workers', label: 'Workers', icon: FiUsers },
    { to: '/admin/jobs', label: 'Jobs', icon: FiBriefcase },
    { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
    { to: '/app/admin/verify', label: 'Verification', icon: FiShield },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();
  const nav = useNavigate();

  const { data: notes } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const res = await api.get('/notifications');
        return res.data?.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!user,
  });

  const unread = (notes || []).filter((n) => !n.isRead).length;
  const userRole = user?.role || 'worker';
  const menu = links[userRole] || links.worker;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-800 dark:text-slate-100">
      <aside className="hidden md:flex w-64 flex-col p-4 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-2 py-3 mb-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-extrabold text-slate-950 shadow-md">
            W
          </div>
          <div>
            <p className="font-extrabold leading-tight text-slate-900 dark:text-white">WorkForce</p>
            <p className="text-xs text-amber-500 font-semibold -mt-0.5">Connect</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menu.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`
              }
            >
              <l.icon className="text-lg" /> {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-all mt-4"
          onClick={async () => {
            await logout();
            nav('/login');
          }}
        >
          <FiLogOut className="text-lg" /> Logout
        </button>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">
              {userRole}
            </span>
            <span className="text-sm font-bold capitalize text-slate-800 dark:text-slate-200">
              Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              onClick={() => api.post('/notifications/read-all').catch(() => { })}
              title="Notifications"
            >
              <FiBell className="text-lg" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 flex items-center justify-center shadow">
                  {unread}
                </span>
              )}
            </button>

            <button
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              onClick={() => setDark(!dark)}
              title="Toggle Dark Mode"
            >
              {dark ? <FiSun className="text-lg text-amber-400" /> : <FiMoon className="text-lg" />}
            </button>

            <span className="text-sm text-slate-500 font-medium hidden sm:block">
              {user?.email || 'User'}
            </span>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
