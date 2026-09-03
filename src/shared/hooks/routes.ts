import { BASE_URL } from '@/src/config';

export const apiRoutes = {
  register: { POST: { query: 'REGISTER', method: 'POST', url: `${BASE_URL}/auth/register` } },
  login: { POST: { query: 'LOGIN', method: 'POST', url: `${BASE_URL}/auth/login` } },
  logout: { POST: { query: 'LOGOUT', method: 'POST', url: `${BASE_URL}/auth/logout` } },
  me: { GET: { query: 'ME', method: 'GET', url: `${BASE_URL}/auth/me` } },
  verifyEmail: { POST: { query: 'VERIFY_EMAIL', method: 'POST', url: `${BASE_URL}/auth/verify-email` } },
  forgotPassword: { POST: { query: 'FORGOT_PASSWORD', method: 'POST', url: `${BASE_URL}/auth/forgot-password` } },
  resetPassword: { POST: { query: 'RESET_PASSWORD', method: 'POST', url: `${BASE_URL}/auth/reset-password` } },
  usersProfile: {
    GET: { query: 'USERS_PROFILE', method: 'GET', url: `${BASE_URL}/users/profile` },
    PATCH: { query: 'USERS_PROFILE_UPDATE', method: 'PATCH', url: `${BASE_URL}/users/profile` },
  },
  usersPreferences: {
    PATCH: { query: 'USERS_PREFERENCES_UPDATE', method: 'PATCH', url: `${BASE_URL}/users/preferences` },
  },
  changePassword: {
    POST: { query: 'CHANGE_PASSWORD', method: 'POST', url: `${BASE_URL}/users/change-password` },
  },
  deactivateAccount: {
    POST: { query: 'DEACTIVATE_ACCOUNT', method: 'POST', url: `${BASE_URL}/users/deactivate` },
  },
  deleteAccount: {
    DELETE: { query: 'DELETE_ACCOUNT', method: 'DELETE', url: `${BASE_URL}/users` },
  },
  transactions: {
    GET: { query: 'GET_TRANSACTIONS', method: 'GET', url: `${BASE_URL}/transactions` },
    POST: { query: 'CREATE_TRANSACTION', method: 'POST', url: `${BASE_URL}/transactions` },
  },
  transactionById: {
    GET: { query: 'GET_TRANSACTION', method: 'GET', url: (id: string) => `${BASE_URL}/transactions/${id}` },
    PATCH: { query: 'UPDATE_TRANSACTION', method: 'PATCH', url: (id: string) => `${BASE_URL}/transactions/${id}` },
    DELETE: { query: 'DELETE_TRANSACTION', method: 'DELETE', url: (id: string) => `${BASE_URL}/transactions/${id}` },
  },
};
