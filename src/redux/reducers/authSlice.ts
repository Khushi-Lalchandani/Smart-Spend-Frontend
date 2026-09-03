'use client';
import { UserData, UserState } from '@/src/utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState: UserState = { authToken: null, userData: null, darkTheme: false };

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.userData = action.payload;
      if (action.payload?.theme) {
        state.darkTheme = action.payload.theme === 'dark';
      }
    },
    removeUser(state) { state.userData = null; },
    setAuthToken(state, action: PayloadAction<string | null>) { state.authToken = action.payload; },
    removeAuthToken(state) { state.authToken = null; },
    setDarkTheme(state, action: PayloadAction<boolean>) { state.darkTheme = action.payload; },
    toggleDarkTheme(state) { state.darkTheme = !state.darkTheme; },
  },
});

export const { setUser, removeUser, setAuthToken, removeAuthToken, setDarkTheme, toggleDarkTheme } = authSlice.actions;
export default authSlice.reducer;

export const selectAuthToken = (state: RootState) => state?.app?.user?.authToken ?? null;
export const selectUser = (state: RootState) => state?.app?.user?.userData ?? null;
export const selectDarkTheme = (state: RootState) => state?.app?.user?.darkTheme ?? false;

