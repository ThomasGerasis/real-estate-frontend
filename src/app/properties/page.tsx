import { Metadata } from 'next';
import Link from 'next/link';
import { propertyService } from '@/lib/api';
import PropertyList from '@/components/PropertyList';
import PropertyFilters from '@/components/PropertyFilters';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ακίνητα - Βρείτε το Ιδανικό σας Σπίτι',
  description: 'Περιηγηθείτε στα διαθέσιμα ακίνητά μας - διαμερίσματα, σπίτια, βίλες και άλλα. Βρείτε το ιδανικό σας σπίτι σήμερα!',
};

interface PropertiesPageProps {
  searchParams: {
    type?: 'sale' | 'rent';
    listing_type?: string;
    property_type?: string;
    city_id?: string;
    district_id?: string;
    subdistrict_id?: string;
    min_price?: string;
    max_price?: string;
    min_area?: string;
    max_area?: string;
    bedrooms?: string;
    bathrooms?: string;
    min_floor?: string;
    max_floor?: string;
    page?: string;
  };
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const filters = {
    listing_type: searchParams.listing_type || searchParams.type,
    property_type: searchParams.property_type,
    city_id: searchParams.city_id ? parseInt(searchParams.city_id) : undefined,
    district_id: searchParams.district_id ? parseInt(searchParams.district_id) : undefined,
    subdistrict_id: searchParams.subdistrict_id ? parseInt(searchParams.subdistrict_id) : undefined,
    min_price: searchParams.min_price ? parseFloat(searchParams.min_price) : undefined,
    max_price: searchParams.max_price ? parseFloat(searchParams.max_price) : undefined,
    min_area: searchParams.min_area ? parseFloat(searchParams.min_area) : undefined,
    max_area: searchParams.max_area ? parseFloat(searchParams.max_area) : undefined,
    bedrooms: searchParams.bedrooms ? parseInt(searchParams.bedrooms) : undefined,
    bathrooms: searchParams.bathrooms ? parseInt(searchParams.bathrooms) : undefined,
    min_floor: searchParams.min_floor ? parseInt(searchParams.min_floor) : undefined,
    max_floor: searchParams.max_floor ? parseInt(searchParams.max_floor) : undefined,
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
            Εξερευνήστε τα Ακίνητά μας
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Βρείτε το ιδανικό σας σπίτι ανάμεσα σε χιλιάδες διαθέσιμα ακίνητα σε όλη την Ελλάδα. Χρησιμοποιήστε τα φίλτρα για να περιορίσετε την αναζήτησή σας και να βρείτε ακριβώς αυτό που ψάχνετε.
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
              <Link
                href="/properties/map"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Χάρτης
              </Link>
            </div>
            <PropertyList properties={response.data || []} pagination={response} />
          </main>
        </div>
      </div>
    </div>
  );
}
