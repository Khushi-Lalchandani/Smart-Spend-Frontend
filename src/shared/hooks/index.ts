'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import useAxios from '@/src/shared/useAxios';
import { apiRoutes } from './routes';
import {
  ILoginResponse,
  IRegisterResponse,
  IMeResponse,
  IUpdateProfileRequest,
  IUpdatePreferencesRequest,
  IChangePasswordRequest,
  IProfileResponse,
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

// Get profile query hook
export const useProfile = (enabled = true) => {
  const { url, method } = apiRoutes.usersProfile.GET;
  const callApi = useAxios();

  return useQuery<IProfileResponse, string>({
    queryKey: [apiRoutes.usersProfile.GET.query],
    queryFn: async () => (await callApi({ method, url })) as IProfileResponse,
    enabled,
  });
};

// Update profile mutation hook
export const useUpdateProfile = () => {
  const { url, method } = apiRoutes.usersProfile.PATCH;
  const callApi = useAxios();

  return useMutation<IProfileResponse, string, IUpdateProfileRequest>({
    mutationFn: async (payload) =>
      (await callApi({
        method,
        url,
        data: payload,
      })) as IProfileResponse,
  });
};

// Update preferences mutation hook
export const useUpdatePreferences = () => {
  const { url, method } = apiRoutes.usersPreferences.PATCH;
  const callApi = useAxios();

  return useMutation<IProfileResponse, string, IUpdatePreferencesRequest>({
    mutationFn: async (payload) =>
      (await callApi({
        method,
        url,
        data: payload,
      })) as IProfileResponse,
  });
};

// Change password mutation hook
export const useChangePassword = () => {
  const { url, method } = apiRoutes.changePassword.POST;
  const callApi = useAxios();

  return useMutation<{ success: boolean }, string, IChangePasswordRequest>({
    mutationFn: async (payload) =>
      (await callApi({
        method,
        url,
        data: payload,
      })) as { success: boolean },
  });
};

// Deactivate account mutation hook
export const useDeactivateAccount = () => {
  const { url, method } = apiRoutes.deactivateAccount.POST;
  const callApi = useAxios();

  return useMutation<{ success: boolean }, string, void>({
    mutationFn: async () =>
      (await callApi({
        method,
        url,
      })) as { success: boolean },
  });
};

// Delete account mutation hook
export const useDeleteAccount = () => {
  const { url, method } = apiRoutes.deleteAccount.DELETE;
  const callApi = useAxios();

  return useMutation<{ success: boolean }, string, void>({
    mutationFn: async () =>
      (await callApi({
        method,
        url,
      })) as { success: boolean },
  });
};
