import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth';
import apiClient from './apiClient';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/api/Auth/login', data);
    const token = response.data.token ?? response.data.Token;
    if (!token) throw new Error('Token alınamadı');
    return { token };
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const payload = {
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      ...(data.phoneNumber ? { phoneNumber: data.phoneNumber } : {}),
    };
    const response = await apiClient.post('/api/Auth/register', payload);
    return { message: response.data.message };
  },
};
