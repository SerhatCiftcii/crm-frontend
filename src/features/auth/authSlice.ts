import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loginUser } from './authThunks';
import type { LoginResponse } from '../../types/auth';
import { parseRoles, parseUserId } from '../../utils/jwt';

interface AuthState {
  token: string | null;
  roles: string[];
  userId: string | null;
  isSuperAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const bootToken = localStorage.getItem('token');
const bootRoles = bootToken ? parseRoles(bootToken) : [];
const bootUserId = bootToken ? parseUserId(bootToken) : null;

const initialState: AuthState = {
  token: bootToken,
  roles: bootRoles,
  userId: bootUserId,
  isSuperAdmin: bootRoles.includes('SuperAdmin'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.roles = [];
      state.userId = null;
      state.isSuperAdmin = false;
      state.error = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.roles = parseRoles(action.payload.token);
        state.userId = parseUserId(action.payload.token);
        state.isSuperAdmin = state.roles.includes('SuperAdmin');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
