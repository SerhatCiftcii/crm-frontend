import apiClient from './apiClient';
import type { AdminListDto, AddAdminDto, AdminStatusUpdateDto } from '../types/admin';

export const adminService = {
  list: async (): Promise<AdminListDto[]> => {
    const res = await apiClient.get('/api/Auth/admin/list');
    return res.data as AdminListDto[];
  },
  add: async (dto: AddAdminDto): Promise<string | { message: string }> => {
    const res = await apiClient.post('/api/Auth/admin/add', dto);
    return res.data as string | { message: string };
  },
  setStatus: async (dto: AdminStatusUpdateDto): Promise<string | { message: string }> => {
    const res = await apiClient.post('/api/Auth/admin/setstatus', dto);
    return res.data as string | { message: string };
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const res = await apiClient.delete(`/api/Auth/admin/delete/${id}`);
    return res.data as { message: string };
  },
};
