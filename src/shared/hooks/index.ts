'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import useAxios from '@/src/shared/useAxios';
import { apiRoutes } from './routes';
import {
  ILoginResponse,
  IRegisterResponse,
  IMeResponse,
} from '@/src/utils/types';

// Login mutation hook
export const useLogin = () => {
  const { url, method } = apiRoutes.login.POST;
  const callApi = useAxios();

  return useMutation<ILoginResponse, string, Record<string, string>>({
    mutationFn: async (payload) =>
      (await callApi({
        method,
        url,
        data: payload,
      })) as ILoginResponse,
  });
};

// Register mutation hook
export const useRegister = () => {
  const { url, method } = apiRoutes.register.POST;
  const callApi = useAxios();

  return useMutation<IRegisterResponse, string, Record<string, string>>({
    mutationFn: async (payload) =>
      (await callApi({
        method,
        url,
        data: payload,
      })) as IRegisterResponse,
  });
};

// Get current user query hook
export const useMe = (enabled = true) => {
  const { url, method } = apiRoutes.me.GET;
  const callApi = useAxios();

  return useQuery<IMeResponse, string>({
    queryKey: [apiRoutes.me.GET.query],
    queryFn: async () => (await callApi({ method, url })) as IMeResponse,
    enabled,
  });
};

// Logout mutation hook
export const useLogout = () => {
  const { url, method } = apiRoutes.logout.POST;
  const callApi = useAxios();

  return useMutation<{ success: boolean }, string, void>({
    mutationFn: async () =>
      (await callApi({
        method,
        url,
      })) as { success: boolean },
  });
};
