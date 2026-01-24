import { apiClient } from '../client';
import { ApiResponse, Property, PaginatedResponse } from '../types';

export interface PropertyFilters {
  type?: 'sale' | 'rent';
  property_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  city_id?: number;
  district_id?: number;
  page?: number;
  per_page?: number;
}

export interface PropertySearchParams extends PropertyFilters {
  q?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export const propertyService = {
  async getProperties(filters?: PropertyFilters): Promise<PaginatedResponse<Property>> {
    return apiClient.get<PaginatedResponse<Property>>('/properties', {
      params: filters as Record<string, string | number | boolean>,
    });
  },

  async getPropertyById(id: number): Promise<Property> {
    const response = await apiClient.get<ApiResponse<Property>>(`/properties/${id}`);
    return response.data;
  },

  async getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    const response = await apiClient.get<ApiResponse<Property[]>>('/properties/featured', {
      params: { limit },
    });
    return response.data;
  },

  async searchProperties(params: PropertySearchParams): Promise<PaginatedResponse<Property>> {
    return apiClient.get<PaginatedResponse<Property>>('/properties/search', {
      params: params as Record<string, string | number | boolean>,
    });
  },

  async getSimilarProperties(id: number, limit: number = 4): Promise<Property[]> {
    const response = await apiClient.get<ApiResponse<Property[]>>(`/properties/${id}/similar`, {
      params: { limit },
    });
    return response.data;
  },
};
