import apiClient from './apiClient';
import { type ProductDto, type CreateProductDto, type UpdateProductDto } from '../types/product';

const getToken = (): string | null => localStorage.getItem('token');

const headers = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const productApi = {
  getAllProducts: async (): Promise<ProductDto[]> => {
    const response = await apiClient.get<ProductDto[]>('/api/Product', { headers: headers() });
    return response.data;
  },

  getProductById: async (id: number): Promise<ProductDto> => {
    const response = await apiClient.get<ProductDto>(`/api/Product/${id}`, { headers: headers() });
    return response.data;
  },

  addProduct: async (data: CreateProductDto): Promise<ProductDto> => {
    const response = await apiClient.post<{ message: string; product: ProductDto }>('/api/Product', data, {
      headers: headers(),
    });
    return response.data.product;
  },

  updateProduct: async (id: number, data: UpdateProductDto): Promise<ProductDto> => {
    const response = await apiClient.put<{ message: string; product: ProductDto }>(`/api/Product/${id}`, data, {
      headers: headers(),
    });
    return response.data.product;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Product/${id}`, { headers: headers() });
  },
};
