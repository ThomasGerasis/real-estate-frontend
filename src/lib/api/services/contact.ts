import { apiClient } from '../client';
import { ApiResponse } from '../types';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  property_id?: number;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
}

export const contactService = {
  async submitContactForm(data: ContactFormData): Promise<ContactFormResponse> {
    const response = await apiClient.post<ApiResponse<ContactFormResponse>>('/contact', data);
    return response.data;
  },

  async submitPropertyInquiry(data: ContactFormData): Promise<ContactFormResponse> {
    const response = await apiClient.post<ApiResponse<ContactFormResponse>>('/property-inquiry', data);
    return response.data;
  },
};
