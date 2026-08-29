import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Login({ defaultRole }) {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: defaultRole === 'admin' ? { email: 'admin@workforceconnect.com', password: 'Admin@123' } : {},
  });
  const { login } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (v) => {
    setErr('');
    setLoading(true);
    try {
      const cleanEmail = String(v.email || '').trim();
      const data = await login(cleanEmail, v.password);
      const role = data?.user?.role;
      if (role === 'admin') nav('/admin/dashboard');
      else if (role === 'employer') nav('/employer/dashboard');
      else if (role === 'recruiter') nav('/recruiter/dashboard');
      else nav('/worker/dashboard');
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setQuickAccount = (email, password) => {
    setValue('email', email);
    setValue('password', password);
    onSubmit({ email, password });
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-slate-950 text-white">
      <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 border-r border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-950">
            W
          </div>
          <span className="font-bold text-xl tracking-tight">WorkForce Connect</span>
        </div>

        <div className="space-y-4 max-w-md">
          <span className="text-xs px-3 py-1 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
            {defaultRole === 'admin' ? 'Admin Gateway' : 'Enterprise Authentication'}
          </span>
          <h1 className="text-4xl font-extrabold leading-tight">
            Connecting Skilled Workforce with Top Employers
          </h1>
          <p className="text-sm text-slate-400">
            Verified digital identity credentials, skill-based trust scores, and instant hiring pipelines.
          </p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-2">
          <p className="font-bold text-slate-200">Quick Demo Logins (1-Click):</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setQuickAccount('owner.tatasteel@workforceconnect.com', 'Owner@123')}
              className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold rounded-lg text-left border border-amber-500/30"
            >
              🏢 Employer
            </button>
            <button
              type="button"
              onClick={() => setQuickAccount('recruiter1.tatasteel@workforceconnect.com', 'Recruiter@123')}
              className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded-lg text-left border border-emerald-500/30"
            >
              👔 Recruiter
            </button>
            <button
              type="button"
              onClick={() => setQuickAccount('worker1@workforceconnect.com', 'Worker@123')}
              className="px-2.5 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-bold rounded-lg text-left border border-blue-500/30"
            >
              👷 Worker
            </button>
            <button
              type="button"
              onClick={() => setQuickAccount('admin@workforceconnect.com', 'Admin@123')}
              className="px-2.5 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-bold rounded-lg text-left border border-purple-500/30"
            >
              🛡️ Admin
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-16 flex flex-col justify-center max-w-md mx-auto w-full">
        <h2 className="text-3xl font-extrabold mb-1">
          {defaultRole === 'admin' ? 'Admin Login' : 'Welcome Back'}
        </h2>
        <p className="text-sm text-slate-400 mb-6">Enter your workspace account credentials.</p>

        {err && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs mb-4">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-amber-500 focus:outline-none"
              placeholder="user@workforceconnect.com"
              {...register('email', { required: true })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-amber-500 focus:outline-none"
              placeholder="••••••••"
              {...register('password', { required: true })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-all shadow-lg text-sm"
          >
            {loading ? 'Signing In...' : 'Sign In to Workspace'}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs mt-6 text-slate-400">
          <Link to="/forgot" className="hover:text-amber-400 transition-colors">Forgot password?</Link>
          <Link to="/register" className="text-amber-500 hover:underline font-semibold">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
