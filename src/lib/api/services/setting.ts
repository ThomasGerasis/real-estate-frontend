import { apiClient } from '../client';
import { ApiResponse, Setting, SiteSettings } from '../types';

export function getStorageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8192/api/v1')
    .replace(/\/api\/v\d+$/, '')
    .replace(/\/api$/, '');
  return `${base}/storage/${path}`;
}

export const settingService = {
  async getAllSettings(): Promise<SiteSettings> {
    const response = await apiClient.get<SiteSettings>('/settings');
    return response;
  },

  async getSettingsByGroup(group: string): Promise<Record<string, string>> {
    const response = await apiClient.get<Record<string, string>>(`/settings/group/${group}`);
    return response;
  },

  async getSettingByKey(key: string): Promise<Setting> {
    const response = await apiClient.get<ApiResponse<Setting>>(`/settings/${key}`);
    return response.data;
  },
};

