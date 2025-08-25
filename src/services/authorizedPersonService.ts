import apiClient from './apiClient';
import  {
   type AuthorizedPersonDto,
   type CreateAuthorizedPersonDto,
   type UpdateAuthorizedPersonDto,
} from '../types/authorizedPerson';

const getToken = (): string | null => localStorage.getItem('token');

const headers = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const authorizedPersonApi = {
  getAll: async (): Promise<AuthorizedPersonDto[]> => {
    const res = await apiClient.get<AuthorizedPersonDto[]>('/api/AuthorizedPerson', { headers: headers() });
    return res.data;
  },
  getById: async (id: number): Promise<AuthorizedPersonDto> => {
    const res = await apiClient.get<AuthorizedPersonDto>(`/api/AuthorizedPerson/${id}`, { headers: headers() });
    return res.data;
  },
  add: async (data: CreateAuthorizedPersonDto): Promise<AuthorizedPersonDto> => {
    const res = await apiClient.post('/api/AuthorizedPerson', data, { headers: headers() });
    return res.data;
  },
  update: async (id: number, data: UpdateAuthorizedPersonDto): Promise<AuthorizedPersonDto> => {
    const res = await apiClient.put(`/api/AuthorizedPerson/${id}`, data, { headers: headers() });
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/AuthorizedPerson/${id}`, { headers: headers() });
  },
};
