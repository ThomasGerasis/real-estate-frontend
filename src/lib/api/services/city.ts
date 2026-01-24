import { apiClient } from '../client';
import { ApiResponse, City, District, PaginatedResponse } from '../types';

export const cityService = {
  async getCities(page?: number, per_page?: number): Promise<PaginatedResponse<City>> {
    return apiClient.get<PaginatedResponse<City>>('/cities', {
      params: { page, per_page } as Record<string, string | number | boolean>,
    });
  },

  async getCityById(id: number): Promise<City> {
    const response = await apiClient.get<ApiResponse<City>>(`/cities/${id}`);
    return response.data;
  },

  async getCityDistricts(cityId: number): Promise<District[]> {
    const response = await apiClient.get<ApiResponse<District[]>>(`/cities/${cityId}/districts`);
    return response.data;
  },
};
