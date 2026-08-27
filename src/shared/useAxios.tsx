'use client';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { removeAuthToken, removeUser } from '@/src/redux/reducers/authSlice';
import { store, useAppDispatch } from '@/src/redux/store';
import { ApiCallParams, ErrorResponse, ErrResponse } from '@/src/utils/types';

const useAxios = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const callApi = useCallback(
    async ({ headers, ...rest }: ApiCallParams): Promise<unknown> => {
      try {
        const { authToken } = store.getState().app.user;
        const { data } = await axios({
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { authorization: `Bearer ${authToken}` } : {}),
            ...headers,
          },
          ...rest,
          validateStatus: (status) => status >= 200 && status <= 299,
        });
        return data;
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.isAxiosError) {
          if (axiosError.code === 'ERR_NETWORK') {
            dispatch(removeAuthToken());
            dispatch(removeUser());
            router.push('/');
            toast.error('Server is under maintenance mode. Please try again later.');
            return;
          } else if (axiosError?.response?.status === 401 || axiosError?.status === 401) {
            dispatch(removeUser());
            dispatch(removeAuthToken());
            setTimeout(() => { router.push('/'); }, 4);
            const errorResponse = axiosError.response?.data as ErrorResponse;
            toast.error(errorResponse?.message || 'Unauthorized');
            return;
          } else if (axiosError.response?.status === 503) {
            router.replace('/404');
            toast.error('Service unavailable');
          }
        }
        throw (axiosError?.response as ErrResponse)?.data?.message ?? (axiosError?.response as ErrResponse)?.message ?? 'Something went wrong';
      }
    },
    [dispatch, router],
  );

  return callApi;
};

export default useAxios;
