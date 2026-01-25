'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Property, PaginatedResponse } from '@/lib/api';

interface PropertyListProps {
  properties: Property[];
  pagination?: PaginatedResponse<Property>;
}

export default function PropertyList({ properties, pagination }: PropertyListProps) {
  const formatPrice = (price: number | string, priceFormatted?: string) => {
    if (priceFormatted) return priceFormatted;
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const getCityName = (city: string | { name: string }) => {
    return typeof city === 'string' ? city : city.name;
  };

  const getArea = (property: Property) => {
    if (property.area) return property.area;
    if (property.square_meters) {
      return typeof property.square_meters === 'string' 
        ? parseFloat(property.square_meters) 
        : property.square_meters;
    }
    return 0;
  };

  const getPropertyImages = (images: PropertyImage[] | string[]) => {
    if (!images || images.length === 0) return [];
    
    // If images is an array of strings, convert to PropertyImage format
    if (typeof images[0] === 'string') {
      return (images as string[]).map((url, index) => ({
        id: index,
        url,
        alt: '',
        order: index,
        is_primary: index === 0,
      }));
    }
    
    return images as PropertyImage[];
  };

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property) => {
          const propertyImages = getPropertyImages(property.images);
          const primaryImage = propertyImages.find(img => img.is_primary) || propertyImages[0];
          
          return (
            <Link 
              key={property.id} 
              href={`/properties/${property.id}`}
              className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {primaryImage ? (
                  <Image
                    src={primaryImage.url}
                    alt={primaryImage.alt || property.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg">
                    {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                  </span>
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg capitalize">
                    {property.type || property.property_type}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {property.title}
                </h3>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="line-clamp-1">{property.address}, {getCityName(property.city)}</span>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-700 dark:text-gray-300">
                  {property.bedrooms && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 9.557V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.525 2 13v4a1 1 0 001 1h1v4h2v-4h12v4h2v-4h1a1 1 0 001-1v-4c0-1.475-.81-2.75-2-3.443zM18 7v2.127c-.315-.083-.652-.127-1-.127s-.685.044-1 .127V7h2zM4 13c0-1.103.897-2 2-2s2 .897 2 2H4zm14 0c0-1.103.897-2 2-2s2 .897 2 2h-4z"/>
                      </svg>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 10H7V7c0-1.103.897-2 2-2s2 .897 2 2h2c0-2.206-1.794-4-4-4S5 4.794 5 7v3H3a1 1 0 00-1 1v2c0 2.606 1.674 4.823 4 5.65V22h2v-3h8v3h2v-3.35c2.326-.827 4-3.044 4-5.65v-2a1 1 0 00-1-1z"/>
                      </svg>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 00.707-1.707l-9-9a.999.999 0 00-1.414 0l-9 9A1 1 0 003 13z"/>
                    </svg>
                    <span className="font-medium">{getArea(property)} m²</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(property.price, property.price_formatted)}
                    </p>
                    {property.listing_type === 'rent' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">per month</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-3 transition-all">
                    View Details
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {pagination && pagination.last_page && pagination.last_page > 1 && (
        <div className="flex justify-center items-center mt-12 gap-2">
          {pagination.current_page && pagination.current_page > 1 && (
            <Link
              href={`?page=${pagination.current_page - 1}`}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Previous
            </Link>
          )}
          
          {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
            let pageNum;
            const currentPage = pagination.current_page || 1;
            if (pagination.last_page <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= pagination.last_page - 2) {
              pageNum = pagination.last_page - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <Link
                key={pageNum}
                href={`?page=${pageNum}`}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  pageNum === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {pageNum}
              </Link>
            );
          })}

          {pagination.current_page && pagination.last_page && pagination.current_page < pagination.last_page && (
            <Link
              href={`?page=${pagination.current_page + 1}`}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </>
  );
}

