import { apiClient } from '../client';

export interface ContactFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  message: string;
}

export interface PropertyInquiryData extends ContactFormData {
  property_id?: number;
}

export interface GeneralInquiryData extends ContactFormData {
  city_id?: string;
  listing_type?: string;
  property_type?: string;
  bedrooms?: string;
  min_price?: string;
  max_price?: string;
}

export interface MandateFormData extends ContactFormData {
  city_id: string;
  listing_type: string;
  property_type: string;
  bedrooms: string;
  price: string;
  square_meters: string;
}

class FormService {
  // 1. General contact form (contact page)
  async submitContact(data: ContactFormData): Promise<{ message: string }> {
    return apiClient.post('/contact', data);
  }

  // 2. Property inquiry form (specific property interest)
  async submitPropertyInquiry(data: PropertyInquiryData): Promise<{ message: string }> {
    return apiClient.post('/property-inquiry', data);
  }

  // 3. General inquiry form (looking for properties with preferences)
  async submitGeneralInquiry(data: GeneralInquiryData): Promise<{ message: string }> {
    return apiClient.post('/inquiry', data);
  }

  // 4. Mandate form (request to sell/rent your property)
  async submitMandate(data: MandateFormData): Promise<{ message: string }> {
    return apiClient.post('/mandate', data);
  }
}

export const formService = new FormService();
