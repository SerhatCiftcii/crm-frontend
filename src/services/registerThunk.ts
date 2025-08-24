import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import type { RegisterRequest, RegisterResponse } from '../types/auth';

export const registerUser = createAsyncThunk<RegisterResponse, RegisterRequest>(
  'auth/register',
  async (data, thunkAPI) => {
    try {
      const res = await authService.register(data);
      return res;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Kayıt yapılamadı');
    }
  }
);
