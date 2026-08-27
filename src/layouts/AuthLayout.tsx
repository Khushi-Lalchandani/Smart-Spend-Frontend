'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/redux/store';
import {
  selectAuthToken,
  selectUser,
  setUser,
  removeAuthToken,
  removeUser,
} from '@/src/redux/reducers/authSlice';
import { useMe } from '@/src/shared/hooks';
import { ChildrenProps, UserData } from '@/src/utils/types';

const PUBLIC_ROUTES = ['/login', '/register'];

const AuthLayout: React.FC<ChildrenProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  
  const authToken = useAppSelector(selectAuthToken);
  const userData = useAppSelector(selectUser);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Fetch user data if we have an auth token but no user details in state
  const { data: meData, error: meError, isLoading: isMeLoading } = useMe(!!authToken && !userData);

  useEffect(() => {
    if (meData) {
      const user = 'data' in meData && meData.data ? (meData.data as UserData) : (meData as UserData);
      dispatch(setUser(user));
    }
  }, [meData, dispatch]);

  useEffect(() => {
    if (meError) {
      dispatch(removeUser());
      dispatch(removeAuthToken());
      router.push('/login');
    }
  }, [meError, dispatch, router]);

  useEffect(() => {
    // If not loading me details
    if (authToken && !userData && isMeLoading) {
      return;
    }

    if (!authToken && !isPublicRoute) {
      // Not logged in and trying to access a protected page
      router.push('/login');
    } else if (authToken && isPublicRoute) {
      // Logged in and trying to access login/register
      router.push('/');
    }
  }, [authToken, userData, isPublicRoute, router, isMeLoading]);

  // Loading state when we are restoring the session
  if (authToken && !userData && isMeLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F5]">
        <p className="text-gray-600 font-medium">Restoring Session...</p>
      </div>
    );
  }

  // Hide protected page content while redirecting unauthenticated users
  if (!authToken && !isPublicRoute) {
    return null;
  }

  // Hide auth pages while redirecting authenticated users
  if (authToken && isPublicRoute) {
    return null;
  }

  return <>{children}</>;
};

export default AuthLayout;
