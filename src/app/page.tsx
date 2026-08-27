'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/src/redux/store';
import { selectUser, removeAuthToken, removeUser } from '@/src/redux/reducers/authSlice';
import { useLogout } from '@/src/shared/hooks';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUser);

  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        dispatch(removeUser());
        dispatch(removeAuthToken());
        toast.success('Successfully logged out.');
        router.push('/login');
      },
      onError: (err) => {
        // Even if the API call fails, we clear local storage and redirect
        dispatch(removeUser());
        dispatch(removeAuthToken());
        toast.error(err || 'Failed to logout cleanly, session cleared.');
        router.push('/login');
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <header className="flex items-center justify-between border-b border-white/5 bg-slate-900/50 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Smart Spend
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-400">{userData?.email}</span>
          <button
            onClick={() => router.push('/profile')}
            className="rounded-lg bg-white/5 px-4 py-2 text-xs font-semibold text-white border border-white/10 transition duration-200 hover:bg-white/10"
          >
            Profile Settings
          </button>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="rounded-lg bg-white/5 px-4 py-2 text-xs font-semibold text-white border border-white/10 transition duration-200 hover:bg-white/10 disabled:opacity-50"
          >
            {isPending ? 'Logging out...' : 'Sign Out'}
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-4xl mx-auto w-full flex flex-col justify-center">
        <div className="rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to Smart Spend</h2>
          <p className="text-slate-400 mb-6">
            Your personal financial manager. The authentication module is fully integrated.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/5 border border-white/5 p-5">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                User Identification
              </span>
              <p className="text-white font-medium mt-1">{userData?.id}</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/5 p-5">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Account Status
              </span>
              <p className="text-emerald-400 font-medium mt-1">
                {userData?.isVerified ? 'Email Verified' : 'Pending Verification'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
