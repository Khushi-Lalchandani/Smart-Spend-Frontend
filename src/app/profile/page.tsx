'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/src/redux/store';
import {
  selectUser,
  setUser,
  removeAuthToken,
  removeUser,
} from '@/src/redux/reducers/authSlice';
import {
  useProfile,
  useUpdateProfile,
  useUpdatePreferences,
  useChangePassword,
  useDeactivateAccount,
  useDeleteAccount,
} from '@/src/shared/hooks';
import { UserData } from '@/src/utils/types';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUser);

  // Fetch complete profile from backend
  const { data: profileResponse, isLoading: isProfileLoading, refetch } = useProfile(!!userData);

  // Form states
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [theme, setTheme] = useState('dark');

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Mutation hooks
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutate: updatePreferences, isPending: isUpdatingPreferences } = useUpdatePreferences();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();
  const { mutate: deactivateAccount, isPending: isDeactivating } = useDeactivateAccount();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  // Load backend profile data into state
  useEffect(() => {
    if (profileResponse?.data) {
      const user = profileResponse.data;
      setName(user.name || '');
      setCurrency(user.currency || 'INR');
      setTheme(user.theme || 'dark');
      dispatch(setUser(user));
    }
  }, [profileResponse, dispatch]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    updateProfile(
      { name },
      {
        onSuccess: (res) => {
          if (res.data) {
            dispatch(setUser(res.data));
          }
          toast.success('Profile updated successfully');
          refetch();
        },
        onError: (err) => {
          toast.error(err || 'Failed to update profile');
        },
      },
    );
  };

  const handleUpdatePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences(
      { currency, theme },
      {
        onSuccess: (res) => {
          if (res.data) {
            dispatch(setUser(res.data));
          }
          toast.success('Preferences updated successfully');
          refetch();
        },
        onError: (err) => {
          toast.error(err || 'Failed to update preferences');
        },
      },
    );
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    changePassword(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          toast.success('Password changed successfully. Please log in again.');
          dispatch(removeUser());
          dispatch(removeAuthToken());
          router.push('/login');
        },
        onError: (err) => {
          toast.error(err || 'Failed to change password');
        },
      },
    );
  };

  const handleDeactivate = () => {
    if (!confirm('Are you sure you want to deactivate your account? You will be signed out.')) {
      return;
    }

    deactivateAccount(undefined, {
      onSuccess: () => {
        toast.success('Account successfully deactivated.');
        dispatch(removeUser());
        dispatch(removeAuthToken());
        router.push('/login');
      },
      onError: (err) => {
        toast.error(err || 'Failed to deactivate account');
      },
    });
  };

  const handleDelete = () => {
    if (
      !confirm(
        'WARNING: This action is permanent! Are you sure you want to permanently delete your account and all financial records?',
      )
    ) {
      return;
    }

    deleteAccount(undefined, {
      onSuccess: () => {
        toast.success('Account permanently deleted.');
        dispatch(removeUser());
        dispatch(removeAuthToken());
        router.push('/login');
      },
      onError: (err) => {
        toast.error(err || 'Failed to delete account');
      },
    });
  };

  if (isProfileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-400 text-sm">Loading profile settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/5 bg-slate-900/50 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-1 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold border border-white/10 transition hover:bg-white/10"
          >
            ← Back to Home
          </button>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Profile Settings
          </span>
        </div>
      </header>

      {/* Main Settings Panel */}
      <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Profile Card */}
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white mb-6">Profile Details</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userData?.email || ''}
                  disabled
                  className="mt-2 block w-full rounded-lg border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-400 cursor-not-allowed outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  disabled={isUpdatingProfile}
                  className="mt-2 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:bg-white/10 focus:border-violet-500/50"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="rounded-lg bg-violet-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-violet-700 disabled:opacity-50"
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Preferences Card */}
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white mb-6">Preferences</h2>
          <form onSubmit={handleUpdatePreferences} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Preferred Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={isUpdatingPreferences}
                  className="mt-2 block w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500/50"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  disabled={isUpdatingPreferences}
                  className="mt-2 block w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500/50"
                >
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingPreferences}
                className="rounded-lg bg-violet-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-violet-700 disabled:opacity-50"
              >
                {isUpdatingPreferences ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white mb-6">Security (Change Password)</h2>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Current Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isChangingPassword}
                  className="mt-2 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:bg-white/10 focus:border-violet-500/50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isChangingPassword}
                    className="mt-2 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:bg-white/10 focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isChangingPassword}
                    className="mt-2 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:bg-white/10 focus:border-violet-500/50"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="rounded-lg bg-violet-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-violet-700 disabled:opacity-50"
              >
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone Card */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 md:p-8 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h2>
          <p className="text-xs text-slate-400 mb-6">
            Sensitive actions that affect your account authentication and records permanently.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-t border-white/5 pt-6">
            <div>
              <h3 className="text-sm font-semibold text-white">Deactivate Account</h3>
              <p className="text-xs text-slate-400 mt-1">Temporarily disable your profile until you contact support.</p>
            </div>
            <button
              onClick={handleDeactivate}
              disabled={isDeactivating}
              className="rounded-lg bg-red-950/40 text-red-400 border border-red-500/30 px-5 py-2.5 text-xs font-bold transition hover:bg-red-900/40 disabled:opacity-50"
            >
              {isDeactivating ? 'Deactivating...' : 'Deactivate Account'}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-t border-white/5 pt-6 mt-6">
            <div>
              <h3 className="text-sm font-semibold text-white">Permanently Delete Account</h3>
              <p className="text-xs text-slate-400 mt-1">Wipe all your profile information and transactions permanently.</p>
            </div>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
