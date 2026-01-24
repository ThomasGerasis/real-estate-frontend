import { apiClient } from '../client';
import { ApiResponse, Page } from '../types';

export const pageService = {
  async getPageBySlug(slug: string): Promise<Page> {
    const response = await apiClient.get<ApiResponse<Page>>(`/pages/${slug}`);
    return response.data;
  },

  async getPageById(id: number): Promise<Page> {
    const response = await apiClient.get<ApiResponse<Page>>(`/pages/${id}`);
    return response.data;
  },
};
