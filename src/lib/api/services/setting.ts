import { apiClient } from '../client';
import { ApiResponse, Setting } from '../types';

export const settingService = {
  async getAllSettings(): Promise<Record<string, any>> {
    const response = await apiClient.get<ApiResponse<Record<string, any>>>('/settings');
    return response.data;
  },

  async getSettingsByGroup(group: string): Promise<Record<string, any>> {
    const response = await apiClient.get<ApiResponse<Record<string, any>>>(`/settings/group/${group}`);
    return response.data;
  },

  async getSettingByKey(key: string): Promise<Setting> {
    const response = await apiClient.get<ApiResponse<Setting>>(`/settings/${key}`);
    return response.data;
  },
};
