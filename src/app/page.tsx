'use client';
import React from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/src/redux/store';
import { selectUser } from '@/src/redux/reducers/authSlice';
import { useGetTransactions } from '@/src/shared/hooks';

export default function HomePage() {
  const userData = useAppSelector(selectUser);
  const { data: txData, isLoading } = useGetTransactions({ page: 1, limit: 5 });

  const recentTransactions = txData?.data || [];
  const totalCount = txData?.meta?.total || 0;

  const formatINR = (amount: number | string) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount));
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 p-8 text-white shadow-xl shadow-indigo-500/10 md:p-10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-indigo-100 backdrop-blur-md">
            Personal Finance Manager
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome back, {userData?.name || userData?.email?.split('@')[0] || 'Saver'}!
          </h1>
          <p className="mt-3 text-base text-indigo-100/90 leading-relaxed">
            Gain clarity over your income and expenses. Track transactions, monitor your financial habits, and optimize your spending with ease.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/transactions"
              className="inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
            >
              Manage Transactions
              <svg className="ml-2 h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Account Preferences
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        
        {/* Total Transactions Counter */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Recorded
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {isLoading ? '...' : totalCount}
            </span>
            <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              Transactions
            </span>
          </div>
          <Link
            href="/transactions"
            className="mt-4 block text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View all transactions &rarr;
          </Link>
        </div>

        {/* Currency & Preferred Settings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Account Currency
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <span className="text-base font-bold">₹</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {userData?.currency || 'INR'}
            </span>
            <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              (₹) Indian Rupee
            </span>
          </div>
          <Link
            href="/profile"
            className="mt-4 block text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Manage profile settings &rarr;
          </Link>
        </div>

        {/* Quick Action Shortcut */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quick Action
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Keep your spending history up to date with new transactions.
          </p>
          <Link
            href="/transactions"
            className="mt-5 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            + Add New Transaction
          </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
          <Link
            href="/transactions"
            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-sm text-slate-500">Loading recent activity...</div>
        ) : recentTransactions.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            No transactions recorded yet.{' '}
            <Link href="/transactions" className="text-indigo-600 underline dark:text-indigo-400">
              Add your first transaction
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3.5">
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs ${
                      t.type === 'INCOME'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {t.type === 'INCOME' ? '↓' : '↑'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(t.date).toLocaleDateString()} {t.category ? `• ${t.category}` : ''}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    t.type === 'INCOME'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {t.type === 'INCOME' ? '+' : '-'}{formatINR(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
