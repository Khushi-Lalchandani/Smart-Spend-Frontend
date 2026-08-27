import { ICommonResponse } from './commonTypes';
import { UserData } from './authSliceTypes';

export interface IUpdateProfileRequest {
  name?: string;
}

export interface IUpdatePreferencesRequest {
  currency?: string;
  theme?: string;
}

export interface IChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
}

export interface IProfileResponse extends ICommonResponse {
  data?: UserData;
}
