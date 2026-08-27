'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/src/redux/store';
import { setAuthToken } from '@/src/redux/reducers/authSlice';
import { useLogin } from '@/src/shared/hooks';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { mutate: login, isPending } = useLogin();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    login(
      { email, password },
      {
        onSuccess: (response) => {
          const token = response.data?.accessToken || response.accessToken;
          if (token) {
            dispatch(setAuthToken(token));
            toast.success('Successfully logged in!');
            router.push('/');
          } else {
            toast.error('Token not found in response');
          }
        },
        onError: (err) => {
          toast.error(err || 'Failed to login');
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-slate-900 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Smart Spend</h1>
          <p className="mt-2 text-sm text-slate-400">Track, understand, and optimize your spending</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={isPending}
              className={`mt-2 block w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-hidden transition duration-200 focus:bg-white/10 ${
                errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-violet-500/50'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isPending}
              className={`mt-2 block w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-hidden transition duration-200 focus:bg-white/10 ${
                errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-violet-500/50'
              }`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:brightness-110 focus:outline-hidden disabled:opacity-50"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => router.push('/register')}
            disabled={isPending}
            className="font-medium text-violet-400 hover:text-violet-300 underline underline-offset-4"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
