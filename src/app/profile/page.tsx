'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/src/redux/store';
import {
  selectUser,
  setUser,
  setDarkTheme,
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
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUser);

  const { data: profileResponse, isLoading: isProfileLoading, refetch } = useProfile(!!userData);

  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [theme, setTheme] = useState('dark');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Confirmation modal states
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutate: updatePreferences, isPending: isUpdatingPreferences } = useUpdatePreferences();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();
  const { mutate: deactivateAccount, isPending: isDeactivating } = useDeactivateAccount();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

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
            dispatch(setDarkTheme(theme === 'dark'));
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

  const confirmDeactivate = () => {
    deactivateAccount(undefined, {
      onSuccess: () => {
        toast.success('Account successfully deactivated.');
        dispatch(removeUser());
        dispatch(removeAuthToken());
        setShowDeactivateModal(false);
        router.push('/login');
      },
      onError: (err) => {
        toast.error(err || 'Failed to deactivate account');
        setShowDeactivateModal(false);
      },
    });
  };

  const confirmDelete = () => {
    deleteAccount(undefined, {
      onSuccess: () => {
        toast.success('Account permanently deleted.');
        dispatch(removeUser());
        dispatch(removeAuthToken());
        setShowDeleteModal(false);
        router.push('/login');
      },
      onError: (err) => {
        toast.error(err || 'Failed to delete account');
        setShowDeleteModal(false);
      },
    });
  };

  if (isProfileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto dark:border-indigo-400"></div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Loading profile settings...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your personal details, preferred currency, theme, and security settings.
        </p>
      </div>

      {/* Profile Details Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">Profile Details</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                value={userData?.email || ''}
                disabled
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                disabled={isUpdatingProfile}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Preferences Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">Preferences</h2>
        <form onSubmit={handleUpdatePreferences} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Preferred Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                disabled={isUpdatingPreferences}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Theme Mode
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                disabled={isUpdatingPreferences}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400"
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
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {isUpdatingPreferences ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>

      {/* Security Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">Security (Change Password)</h2>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isChangingPassword}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isChangingPassword}
                  className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isChangingPassword}
                  className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 shadow-sm dark:border-red-900/40 dark:bg-red-950/20 md:p-8">
        <h2 className="text-base font-bold text-red-600 dark:text-red-400 mb-1">Danger Zone</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Actions that permanently impact your profile and transaction history.
        </p>
        
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-t border-red-100 dark:border-red-900/30 pt-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Deactivate Account</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Temporarily disable your profile and sign out.</p>
          </div>
          <button
            onClick={() => setShowDeactivateModal(true)}
            disabled={isDeactivating}
            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/40 disabled:opacity-50"
          >
            Deactivate Account
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-t border-red-100 dark:border-red-900/30 pt-6 mt-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Permanently Delete Account</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Wipe all your profile information and transactions completely.</p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
          >
            Delete Permanently
          </button>
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Deactivate Account?</h2>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to deactivate your account? You will be signed out immediately.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                disabled={isDeactivating}
                className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeactivate}
                disabled={isDeactivating}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              >
                {isDeactivating ? 'Deactivating...' : 'Confirm Deactivation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-2 text-lg font-bold text-red-600 dark:text-red-400">Permanently Delete Account?</h2>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
              WARNING: This action cannot be undone. All your profile data and transaction history will be permanently wiped.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
