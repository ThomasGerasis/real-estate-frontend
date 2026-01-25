'use client';

import { useEffect, useState } from 'react';
import { propertyService, Property, PropertyImage, ApiError } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        console.log('[FeaturedProperties] Fetching...');
        const data = await propertyService.getFeaturedProperties(6);
        console.log('[FeaturedProperties] Data received:', data);
        console.log('[FeaturedProperties] First property images:', data[0]?.images);
        setProperties(data);
      } catch (err) {
        console.error('[FeaturedProperties] Error:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to fetch properties');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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
    console.log('[getPropertyImages] Input images:', images);
    if (!images || images.length === 0) return [];
    
    // If images is an array of strings, convert to PropertyImage format
    if (typeof images[0] === 'string') {
      const converted = (images as string[]).map((url, index) => ({
        id: index,
        url,
        alt: '',
        order: index,
        is_primary: index === 0,
      }));
      console.log('[getPropertyImages] Converted string images to:', converted);
      return converted;
    }
    
    console.log('[getPropertyImages] Already PropertyImage format');
    return images as PropertyImage[];
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading featured properties...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 text-red-600 dark:text-red-400">
            <p className="text-xl font-semibold mb-2">Error loading featured properties</p>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            <p className="text-xl">No featured properties found</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3 uppercase tracking-wide text-sm">
            Featured Properties
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Inspiring Designed Homes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Curated homes where elegance, style, and comfort unite
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((property) => {
            console.log('[Rendering property]', property.id, 'images:', property.images);
            const propertyImages = getPropertyImages(property.images);
            console.log('[Rendering property]', property.id, 'propertyImages:', propertyImages);
            const primaryImage = propertyImages.find(img => img.is_primary) || propertyImages[0];
            console.log('[Rendering property]', property.id, 'primaryImage:', primaryImage);
            
            return (
              <Link 
                key={property.id} 
                href={`/properties/${property.id}`}
                className="group block bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
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
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg">
                      {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {property.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {getCityName(property.city)}, {property.country}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-700 dark:text-gray-300 pb-4 border-b border-gray-100 dark:border-gray-700">
                    {property.bedrooms && (
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold">{property.bedrooms}</span> beds
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold">{property.bathrooms}</span> baths
                      </span>
                    )}
                    {getArea(property) > 0 && (
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold">{getArea(property)}</span> m²
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(property.price, property.price_formatted)}
                      {property.listing_type === 'rent' && <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/mo</span>}
                    </p>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-2 flex items-center gap-1 transition-all">
                      View
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link 
            href="/properties" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            View All Properties
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
