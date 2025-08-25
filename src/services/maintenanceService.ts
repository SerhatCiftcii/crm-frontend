// src/services/maintenanceService.ts

import apiClient from './apiClient';
import type { MaintenanceDto, CreateMaintenanceDto, UpdateMaintenanceDto } from '../types/maintenance';

export const maintenanceService = {
  getAllMaintenances: async (): Promise<MaintenanceDto[]> => {
    const response = await apiClient.get<MaintenanceDto[]>('/api/Maintenance');
    return response.data;
  },

  addMaintenance: async (data: CreateMaintenanceDto): Promise<MaintenanceDto> => {
    const response = await apiClient.post<MaintenanceDto>('/api/Maintenance', data);
    return response.data;
  },

  updateMaintenance: async (id: number, data: UpdateMaintenanceDto): Promise<void> => {
    await apiClient.put(`/api/Maintenance/${id}`, data);
  },

  deleteMaintenance: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Maintenance/${id}`);
  },
};