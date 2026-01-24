import { apiClient } from '../client';
import { ApiResponse, MenuItem } from '../types';

export const menuService = {
  async getAllMenus(): Promise<MenuItem[]> {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>('/menu');
    return response.data;
  },

  async getHeaderMenu(): Promise<MenuItem[]> {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>('/menu/header');
    return response.data;
  },

  async getFooterMenu(): Promise<MenuItem[]> {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>('/menu/footer');
    return response.data;
  },
};
