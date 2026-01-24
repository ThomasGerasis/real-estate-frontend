# Real Estate Website - Dynamic Pages Setup

## 🎯 Overview
This setup enables dynamic page generation from your Laravel API running on port 8192.

## 📁 Structure Created

### API Layer (`src/lib/api/`)
- **client.ts** - Base API client with HTTP methods
- **types.ts** - TypeScript interfaces for all data types
- **services/**
  - `menu.ts` - Menu/navigation API calls
  - `property.ts` - Real estate property API calls
  - `page.ts` - Dynamic pages API calls

### Dynamic Routes

#### 1. Properties Listing
**Route:** `/properties`
**File:** `src/app/properties/page.tsx`
- Lists all properties with pagination
- Supports filters (type, city, price, etc.)
- Example: `/properties?type=sale&city=Athens&page=2`

#### 2. Property Detail
**Route:** `/properties/[slug]`
**File:** `src/app/properties/[slug]/page.tsx`
- Shows full property details
- Image gallery
- Features, specs, location
- Example: `/properties/luxury-villa-athens`

#### 3. Dynamic Pages
**Route:** `/[slug]`
**File:** `src/app/[slug]/page.tsx`
- CMS-driven pages (About, Contact, etc.)
- Example: `/about-us`, `/contact`

### Components
- **PropertyDetail.tsx** - Full property page component
- **PropertyList.tsx** - Property grid with pagination
- **FeaturedProperties.tsx** - Homepage featured properties
- **MenuExample.tsx** - Dynamic navigation menu

## 🚀 Usage Examples

### Fetch Menu
```typescript
import { menuService } from '@/lib/api';

const menu = await menuService.getMenu();
```

### Fetch Properties
```typescript
import { propertyService } from '@/lib/api';

// Get all properties
const properties = await propertyService.getProperties({
  type: 'sale',
  city: 'Athens',
  min_price: 100000,
  max_price: 500000,
  page: 1,
  per_page: 12
});

// Get single property
const property = await propertyService.getPropertyBySlug('villa-santorini');

// Get featured properties
const featured = await propertyService.getFeaturedProperties(6);
```

### Fetch Dynamic Page
```typescript
import { pageService } from '@/lib/api';

const page = await pageService.getPageBySlug('about-us');
```

## ⚙️ Configuration

### Environment Variables
Create/update `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8192/api
```

For production:
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## 📋 Laravel API Expected Endpoints

Your Laravel API should provide these endpoints:

### Menu
- `GET /api/menu` - Get navigation menu

### Properties
- `GET /api/properties` - List properties (with filters)
- `GET /api/properties/{slug}` - Get property by slug
- `GET /api/properties/featured` - Get featured properties

### Pages
- `GET /api/pages/{slug}` - Get page by slug

## 📊 Expected Response Format

### Properties
```json
{
  "data": {
    "id": 1,
    "slug": "luxury-villa-santorini",
    "title": "Luxury Villa in Santorini",
    "description": "...",
    "price": 850000,
    "type": "sale",
    "property_type": "villa",
    "bedrooms": 4,
    "bathrooms": 3,
    "area": 250,
    "address": "Oia",
    "city": "Santorini",
    "country": "Greece",
    "images": [
      {
        "id": 1,
        "url": "https://...",
        "alt": "Villa exterior",
        "order": 1,
        "is_primary": true
      }
    ],
    "features": [
      {
        "id": 1,
        "name": "Pool",
        "value": null
      }
    ],
    "status": "available"
  }
}
```

### Paginated List
```json
{
  "data": [...],
  "current_page": 1,
  "last_page": 5,
  "per_page": 12,
  "total": 60
}
```

## 🎨 Adding to Homepage

Add featured properties to your homepage:

```tsx
import FeaturedProperties from '@/components/FeaturedProperties';

export default function Home() {
  return (
    <>
      {/* Your existing content */}
      <FeaturedProperties />
    </>
  );
}
```

## 🔧 Next Steps

1. Ensure your Laravel API is running on port 8192
2. Set up CORS in Laravel to allow requests from Next.js
3. Test the API endpoints match the expected format
4. Customize the components to match your design
5. Add more services as needed (agents, inquiries, etc.)

## 📝 Adding More Services

Create new service file in `src/lib/api/services/`:

```typescript
// src/lib/api/services/agent.ts
import { apiClient } from '../client';
import { ApiResponse } from '../types';

export interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export const agentService = {
  async getAgents(): Promise<Agent[]> {
    const response = await apiClient.get<ApiResponse<Agent[]>>('/agents');
    return response.data;
  },
};
```

Then export in `src/lib/api/index.ts`:
```typescript
export * from './services/agent';
```
