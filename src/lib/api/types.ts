export interface MenuItem {
  id: number;
  label: string;
  url: string;
  icon?: string | null;
  sort_order: number;
  open_in_new_tab: boolean;
  parent_id?: number | null;
  children?: MenuItem[];
}

export interface Property {
  id: number;
  slug?: string;
  title: string;
  description: string;
  price: number | string;
  price_formatted?: string;
  type: 'apartment' | 'house' | 'villa' | 'land' | 'commercial';
  listing_type: 'sale' | 'rent';
  property_type?: 'apartment' | 'house' | 'villa' | 'land' | 'commercial';
  status: 'available' | 'sold' | 'rented' | 'pending';
  bedrooms?: number;
  bathrooms?: number;
  square_meters?: string | number;
  area?: number;
  year_built?: number;
  energy_class?: string;
  garage?: number;
  address: string;
  city: string | City;
  city_id?: number;
  district?: District;
  district_id?: number;
  state?: string;
  country?: string;
  postal_code?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  featured_image?: string;
  images: PropertyImage[] | string[];
  features?: PropertyFeature[];
  extra_details?: Record<string, any>;
  agent_id?: number;
  agent?: Agent;
  is_featured?: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  seo?: {
    title: string;
    description: string;
  };
}

export interface PropertyImage {
  id: number;
  url: string;
  alt?: string;
  order: number;
  is_primary: boolean;
}

export interface PropertyFeature {
  id: number;
  name: string;
  value?: string;
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  template?: 'default' | 'contact' | 'about' | 'properties' | 'full-width' | string;
  shortcodes?: PageShortcode[];
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface PageShortcode {
  type: 'contact-form' | 'property-inquiry-form' | string;
  position: number;
  data?: {
    property_id?: number;
    property_title?: string;
    [key: string]: any;
  };
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author?: string;
  category?: string;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  avatar?: string;
  bio?: string;
  position?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  properties_count?: number;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: number;
  name: string;
  slug?: string;
  country?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  properties_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface District {
  id: number;
  name: string;
  slug?: string;
  city_id: number;
  latitude?: number;
  longitude?: number;
  properties_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  group?: string;
  type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links?: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
  // Convenience properties for backward compatibility
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}
