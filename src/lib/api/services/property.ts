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
    console.log('[PropertyService] Calling API with filters:', filters);
    
    // Remove undefined values from filters
    const cleanFilters = filters ? Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    ) : {};
    
    console.log('[PropertyService] Clean filters:', cleanFilters);
    
    const response = await apiClient.get<PaginatedResponse<Property>>('/properties', {
      params: cleanFilters as Record<string, string | number | boolean>,
    });
    console.log('[PropertyService] Raw API response:', {
      hasData: !!response.data,
      dataLength: response.data?.length,
      hasMeta: !!response.meta,
      metaTotal: response.meta?.total,
    });
    // Add convenience properties from meta for backward compatibility
    const result = {
      ...response,
      current_page: response.meta.current_page,
      last_page: response.meta.last_page,
      per_page: response.meta.per_page,
      total: response.meta.total,
    };
    console.log('[PropertyService] Returning result:', {
      dataLength: result.data?.length,
      total: result.total,
    });
    return result;
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
    // Remove undefined values from params
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    
    const response = await apiClient.get<PaginatedResponse<Property>>('/properties/search', {
      params: cleanParams as Record<string, string | number | boolean>,
    });
    // Add convenience properties from meta for backward compatibility
    return {
      ...response,
      current_page: response.meta.current_page,
      last_page: response.meta.last_page,
      per_page: response.meta.per_page,
      total: response.meta.total,
    };
  },

  async getSimilarProperties(id: number, limit: number = 4): Promise<Property[]> {
    const response = await apiClient.get<ApiResponse<Property[]>>(`/properties/${id}/similar`, {
      params: { limit },
    });
    return response.data;
  },
};
