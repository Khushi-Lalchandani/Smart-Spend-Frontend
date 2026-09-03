'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRegister } from '@/src/shared/hooks';

export default function RegisterPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  const { mutate: register, isPending } = useRegister();

  const validate = () => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    register(
      { email, password },
      {
        onSuccess: () => {
          toast.success('Registration successful! Please sign in to continue.');
          router.push('/login');
        },
        onError: (err) => {
          toast.error(err || 'Failed to register');
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
            Create an account to start managing your personal finances
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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isPending}
              className={`mt-2 block w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800 ${
                errors.confirmPassword
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:border-indigo-500 dark:border-slate-700 dark:focus:border-indigo-400'
              }`}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700 focus:outline-none disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {isPending ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            disabled={isPending}
            className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
