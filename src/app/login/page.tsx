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
          const token = response?.data?.accessToken || response.accessToken;
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 transition-colors duration-200 dark:bg-[#090d16]">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900">
        
        {/* Header Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20">
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-1h-1c-.55 0-1-.45-1-1v-3c0-.55.45-1 1-1h3v-1h-3v-2h2v-1h2v1h1c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1h-3v1h3v2h-2v1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Smart Spend
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Track, understand, and optimize your spending
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={isPending}
              className={`mt-2 block w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800 ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:border-indigo-500 dark:border-slate-700 dark:focus:border-indigo-400'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isPending}
              className={`mt-2 block w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800 ${
                errors.password
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:border-indigo-500 dark:border-slate-700 dark:focus:border-indigo-400'
              }`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700 focus:outline-none disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => router.push('/register')}
            disabled={isPending}
            className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
