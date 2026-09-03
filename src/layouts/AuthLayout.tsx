'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/redux/store';
import {
  selectAuthToken,
  selectUser,
  selectDarkTheme,
  setUser,
  removeAuthToken,
  removeUser,
} from '@/src/redux/reducers/authSlice';
import { useProfile } from '@/src/shared/hooks';
import { ChildrenProps, UserData } from '@/src/utils/types';
import Navigation from '@/src/components/Navigation';

const PUBLIC_ROUTES = ['/login', '/register'];

const AuthLayout: React.FC<ChildrenProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  
  const authToken = useAppSelector(selectAuthToken);
  const userData = useAppSelector(selectUser);
  const darkTheme = useAppSelector(selectDarkTheme);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Sync theme class with document root
  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkTheme]);

  // Fetch complete user profile if logged in but name/details are missing
  const { data: profileResponse, error: profileError, isLoading: isProfileLoading } = useProfile(
    !!authToken && (!userData || !userData.name)
  );

  useEffect(() => {
    if (profileResponse?.data) {
      dispatch(setUser(profileResponse.data as UserData));
    }
  }, [profileResponse, dispatch]);

  useEffect(() => {
    if (profileError) {
      dispatch(removeUser());
      dispatch(removeAuthToken());
      router.push('/login');
    }
  }, [profileError, dispatch, router]);

  useEffect(() => {
    if (authToken && (!userData || !userData.name) && isProfileLoading) {
      return;
    }

    if (!authToken && !isPublicRoute) {
      router.push('/login');
    } else if (authToken && isPublicRoute) {
      router.push('/');
    }
  }, [authToken, userData, isPublicRoute, router, isProfileLoading]);

  if (authToken && (!userData || !userData.name) && isProfileLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400"></div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Restoring Session...</p>
        </div>
      </div>
    );
  }

  if (!authToken && !isPublicRoute) {
    return null;
  }

  if (authToken && isPublicRoute) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#090d16] dark:text-slate-100 flex flex-col">
      {!isPublicRoute && authToken && <Navigation />}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default AuthLayout;
