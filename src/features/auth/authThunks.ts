import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import type { LoginRequest, LoginResponse } from '../../types/auth';

export const loginUser = createAsyncThunk<LoginResponse, LoginRequest>(
  'auth/login',
  async (data, thunkAPI) => {
    try {
      const res = await authService.login(data);
      // Token'ı localStorage'a kaydet
      localStorage.setItem('token', res.token);
      return res;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
