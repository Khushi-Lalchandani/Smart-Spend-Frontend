export interface UserData {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  name?: string | null;
  currency?: string;
  theme?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserState {
  authToken: string | null;
  userData: UserData | null;
  darkTheme: boolean;
}
