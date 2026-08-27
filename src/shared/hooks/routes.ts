import { BASE_URL } from '@/src/config';

export const apiRoutes = {
  register: { POST: { query: 'REGISTER', method: 'POST', url: `${BASE_URL}/auth/register` } },
  login: { POST: { query: 'LOGIN', method: 'POST', url: `${BASE_URL}/auth/login` } },
  logout: { POST: { query: 'LOGOUT', method: 'POST', url: `${BASE_URL}/auth/logout` } },
  me: { GET: { query: 'ME', method: 'GET', url: `${BASE_URL}/auth/me` } },
  verifyEmail: { POST: { query: 'VERIFY_EMAIL', method: 'POST', url: `${BASE_URL}/auth/verify-email` } },
  forgotPassword: { POST: { query: 'FORGOT_PASSWORD', method: 'POST', url: `${BASE_URL}/auth/forgot-password` } },
  resetPassword: { POST: { query: 'RESET_PASSWORD', method: 'POST', url: `${BASE_URL}/auth/reset-password` } },
};
