'use client';
import ReduxProvider from '@/src/redux/redux-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import AuthLayout from './AuthLayout';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
  }));
  const [loading, setLoading] = useState(true);

  useEffect(() => { setLoading(false); }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F5]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <AuthLayout>{children}</AuthLayout>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export default MainLayout;
