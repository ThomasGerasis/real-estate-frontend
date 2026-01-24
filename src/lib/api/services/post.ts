import { apiClient } from '../client';
import { ApiResponse, Post, PaginatedResponse } from '../types';

export interface PostFilters {
  category?: string;
  tag?: string;
  page?: number;
  per_page?: number;
}

export const postService = {
  async getPosts(filters?: PostFilters): Promise<PaginatedResponse<Post>> {
    return apiClient.get<PaginatedResponse<Post>>('/posts', {
      params: filters as Record<string, string | number | boolean>,
    });
  },

  async getPostBySlug(slug: string): Promise<Post> {
    const response = await apiClient.get<ApiResponse<Post>>(`/posts/${slug}`);
    return response.data;
  },

  async getLatestPosts(limit: number = 5): Promise<Post[]> {
    const response = await apiClient.get<ApiResponse<Post[]>>('/posts/latest', {
      params: { limit },
    });
    return response.data;
  },
};
