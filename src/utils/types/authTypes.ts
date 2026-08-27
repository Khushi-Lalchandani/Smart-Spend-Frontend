import { ICommonResponse } from './commonTypes';
import { UserData } from './authSliceTypes';

export interface ILoginResponse extends ICommonResponse {
  data?: {
    accessToken: string;
  };
  accessToken?: string; // fallback in case direct mapping is returned
}

export interface IRegisterResponse extends ICommonResponse {
  user: UserData;
  verificationToken?: string;
}

export interface IMeResponse extends ICommonResponse {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}
