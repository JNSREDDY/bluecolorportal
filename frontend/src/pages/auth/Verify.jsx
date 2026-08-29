import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/client';
import { Link } from 'react-router-dom';

export default function Verify() {
  const [params] = useSearchParams();
  const email = params.get('email');
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const onSubmit = async (v) => {
    try {
      setLoading(true);
      await api.post('/auth/reset-password', { email, ...v });
      setMsg('Password updated successfully. Redirecting to login...');
      setTimeout(() => nav('/login'), 2000);
    } catch (e) {
      setMsg(e.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card max-w-md w-full">
          <h1 className="font-display text-2xl font-bold mb-4">Invalid Reset Link</h1>
          <p className="text-sm mb-4">This reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="text-brand-600">Request a new reset link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="card max-w-md w-full">
        <h1 className="font-display text-2xl font-bold">Reset password</h1>
        {msg && <p className="text-sm text-brand-600 mb-3">{msg}</p>}
        <input className="input mb-3" type="password" placeholder="New password" {...register('password', { required: true, minLength: 8 })} />
        <input className="input mb-4" type="password" placeholder="Confirm password" {...register('confirmPassword', { required: true, minLength: 8 })} />
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Updating...' : 'Update Password'}</button>
      </form>
    </div>
  );
}
