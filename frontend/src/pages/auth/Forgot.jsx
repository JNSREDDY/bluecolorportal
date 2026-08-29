import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api from '../../api/client';
import { Link } from 'react-router-dom';

export default function Forgot() {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const send = async (v) => {
    try {
      setError('');
      await api.post('/auth/forgot-password', v);
      setMessage('Password reset link sent to your email. Check your inbox.');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to send reset link');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-md w-full">
        <form onSubmit={handleSubmit(send)}>
          <h1 className="font-display text-2xl font-bold mb-4">Forgot password</h1>
          {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <input className="input mb-4" type="email" placeholder="Enter your email" {...register('email', { required: true })} />
          <button className="btn-primary w-full">Send Reset Link</button>
          <p className="text-sm mt-4">Remember your password? <Link className="text-brand-600" to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
}
