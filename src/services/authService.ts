
import type { LoginRequest, LoginResponse } from '../types/auth';
import apiClient from './apiClient';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/api/Auth/login', data);
      const raw = response.data;
      const token = (raw?.token ?? raw?.Token) as string;
      if (!token) throw new Error('Token alınamadı');
      return { token };
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Kullanıcı adı veya şifre yanlış');
      }
      throw new Error(error.message || 'Bir hata oluştu');
    }
  },
};