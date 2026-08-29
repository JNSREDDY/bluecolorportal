import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') === 'employer' ? 'employer' : 'worker');
  const { register, handleSubmit } = useForm();
  const { loadMe } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState('');
  const onSubmit = async (v) => {
    try {
      const url = role === 'employer' ? '/auth/register/employer' : '/auth/register/worker';
      const res = await api.post(url, v);
      if (res?.accessToken) {
        localStorage.setItem('wfc_access', res.accessToken);
        await loadMe();
        const dashboard = role === 'worker' ? '/worker/dashboard' : '/employer/dashboard';
        nav(dashboard, { replace: true });
        return;
      }
      nav('/login');
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration failed');
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="card max-w-lg w-full">
        <h1 className="font-display text-2xl font-bold">Create your identity</h1>
        <div className="flex gap-2 my-4">
          {['worker', 'employer'].map((r) => (
            <button type="button" key={r} onClick={() => setRole(r)} className={`flex-1 py-2 rounded-xl border ${role === r ? 'bg-brand-700 text-white' : ''}`}>{r}</button>
          ))}
        </div>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <p className="text-xs text-slate-500 mb-3">Recruiters cannot self-register. They must be invited by a company owner.</p>
        {role === 'worker' ? (
          <>
            <input className="input mb-3" placeholder="First name" {...register('firstName', { required: true })} />
            <input className="input mb-3" placeholder="Last name" {...register('lastName', { required: true })} />
            <input className="input mb-3" placeholder="Phone" {...register('phone')} />
          </>
        ) : (
          <>
            <input className="input mb-3" placeholder="Your full name" {...register('fullName', { required: true })} />
            <input className="input mb-3" placeholder="Company name" {...register('companyName', { required: true })} />
            <input className="input mb-3" placeholder="GST" {...register('gst')} />
            <input className="input mb-3" placeholder="PAN" {...register('pan')} />
            <input className="input mb-3" placeholder="Industry" {...register('industry')} />
            <input className="input mb-3" placeholder="City" {...register('city')} />
          </>
        )}
        <input className="input mb-3" type="email" placeholder="Email" {...register('email', { required: true })} />
        <input className="input mb-4" type="password" placeholder="Password (min 8)" {...register('password', { required: true, minLength: 8 })} />
        <button className="btn-primary w-full">Register</button>
        <p className="text-sm mt-4">Already have an account? <Link className="text-brand-600" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
