export interface UserData {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface UserState {
  authToken: string | null;
  userData: UserData | null;
  darkTheme: boolean;
}
