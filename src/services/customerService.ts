// src/services/customerService.ts
import apiClient from './apiClient';
import {
  type CustomerDto,
  type CreateCustomerDto,
  type UpdateCustomerDto,
  type CustomerChangeLogDto,
} from '../types/customer';

const getToken = (): string | null => localStorage.getItem('token');

const headers = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const customerService = {
  getAllCustomers: async (): Promise<CustomerDto[]> => {
    const response = await apiClient.get<CustomerDto[]>('/api/Customer', { headers: headers() });
    return response.data;
  },

  getCustomerById: async (id: number): Promise<CustomerDto> => {
    const response = await apiClient.get<CustomerDto>(`/api/Customer/${id}`, { headers: headers() });
    return response.data;
  },

  addCustomer: async (data: CreateCustomerDto): Promise<CustomerDto> => {
    const response = await apiClient.post<CustomerDto>('/api/Customer', data, { headers: headers() });
    return response.data;
  },

  updateCustomer: async (id: number, data: UpdateCustomerDto): Promise<void> => {
    await apiClient.put(`/api/Customer/${id}`, data, { headers: headers() });
  },

  deleteCustomer: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Customer/${id}`, { headers: headers() });
  },

  getCustomerChangeLogs: async (): Promise<CustomerChangeLogDto[]> => {
    const response = await apiClient.get<CustomerChangeLogDto[]>('/api/CustomerChangeLog/all', { headers: headers() });
    return response.data;
  },

  getCustomerChangeLogsByCustomerId: async (customerId: number): Promise<CustomerChangeLogDto[]> => {
    const response = await apiClient.get<CustomerChangeLogDto[]>(`/api/CustomerChangeLog/${customerId}`, { headers: headers() });
    return response.data;
  },

  getCustomerChangeLogExcel: async (): Promise<Blob> => {
    const response = await apiClient.get('/api/CustomerChangeLog/excel', {
      headers: headers(),
      responseType: 'blob',
    });
    return response.data;
  },
};
