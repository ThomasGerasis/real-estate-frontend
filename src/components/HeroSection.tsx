'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { propertyService, Property, ApiError } from '@/lib/api';
import Image from 'next/image';

export default function HeroSection() {
  const [featuredProperty, setFeaturedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const properties = await propertyService.getFeaturedProperties(1);
        if (properties.length > 0) {
          setFeaturedProperty(properties[0]);
        }
      } catch (error) {
        console.error('Failed to fetch featured property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
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

  if (loading || !featuredProperty) {
    return (
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  // Get featured image or fallback to first image in images array
  let imageUrl: string | null = null;
  if (featuredProperty.featured_image) {
    imageUrl = featuredProperty.featured_image;
  } else if (featuredProperty.images && featuredProperty.images.length > 0) {
    const firstImage = featuredProperty.images[0];
    imageUrl = typeof firstImage === 'string' ? firstImage : firstImage.url;
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 md:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-block mb-6">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Featured Property
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {featuredProperty.title}
            </h1>

            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-8">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-lg">{featuredProperty.address}, {getCityName(featuredProperty.city)}</span>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-xl">
              {featuredProperty.description.substring(0, 200)}...
            </p>

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {featuredProperty.bedrooms && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 9.557V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.525 2 13v4a1 1 0 001 1h1v4h2v-4h12v4h2v-4h1a1 1 0 001-1v-4c0-1.475-.81-2.75-2-3.443z"/>
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{featuredProperty.bedrooms}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</p>
                </div>
              )}
              
              {featuredProperty.bathrooms && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 10H7V7c0-1.103.897-2 2-2s2 .897 2 2h2c0-2.206-1.794-4-4-4S5 4.794 5 7v3H3a1 1 0 00-1 1v2c0 2.606 1.674 4.823 4 5.65V22h2v-3h8v3h2v-3.35c2.326-.827 4-3.044 4-5.65v-2a1 1 0 00-1-1z"/>
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{featuredProperty.bathrooms}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</p>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 00.707-1.707l-9-9a.999.999 0 00-1.414 0l-9 9A1 1 0 003 13z"/>
                  </svg>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{getArea(featuredProperty)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">m² Area</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                    <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"/>
                  </svg>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{new Date().getFullYear()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Built Year</p>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starting from</p>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(featuredProperty.price, featuredProperty.price_formatted)}
                </p>
              </div>
              <Link
                href={`/properties/${featuredProperty.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                View Details
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {imageUrl ? (
                <div className="relative aspect-[4/5]">
                  <Image
                    src={imageUrl}
                    alt={featuredProperty.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"></div>
              )}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-purple-600 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
