import { Metadata } from 'next';
import { propertyService } from '@/lib/api';
import PropertyList from '@/components/PropertyList';
import PropertyFilters from '@/components/PropertyFilters';

export const metadata: Metadata = {
  title: 'Properties - Find Your Dream Home',
  description: 'Browse our available properties - apartments, houses, villas and more',
};

interface PropertiesPageProps {
  searchParams: {
    type?: 'sale' | 'rent';
    property_type?: string;
    city_id?: string;
    district_id?: string;
    min_price?: string;
    max_price?: string;
    bedrooms?: string;
    bathrooms?: string;
    page?: string;
  };
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const filters = {
    type: searchParams.type,
    property_type: searchParams.property_type,
    city_id: searchParams.city_id ? parseInt(searchParams.city_id) : undefined,
    district_id: searchParams.district_id ? parseInt(searchParams.district_id) : undefined,
    min_price: searchParams.min_price ? parseFloat(searchParams.min_price) : undefined,
    max_price: searchParams.max_price ? parseFloat(searchParams.max_price) : undefined,
    bedrooms: searchParams.bedrooms ? parseInt(searchParams.bedrooms) : undefined,
    bathrooms: searchParams.bathrooms ? parseInt(searchParams.bathrooms) : undefined,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    per_page: 12,
  };

  const response = await propertyService.getProperties(filters);

  console.log('Properties API Response:', {
    dataLength: response.data?.length || 0,
    total: response.total,
    meta: response.meta,
    hasData: !!response.data,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Properties
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Explore our curated collection of premium properties designed for modern living
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <PropertyFilters />
          </aside>

          {/* Properties List */}
          <main className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{response.data?.length || 0}</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{response.total || 0}</span> properties
              </p>
            </div>
            <PropertyList properties={response.data || []} pagination={response} />
          </main>
        </div>
      </div>
    </div>
  );
}
