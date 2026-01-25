'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Property, PropertyImage } from '@/lib/api';
import { useState } from 'react';

interface PropertyDetailProps {
  property: Property;
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const formatPrice = (price: number | string) => {
    if (property.price_formatted) {
      return property.price_formatted;
    }
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const getCityName = () => {
    return typeof property.city === 'string' ? property.city : property.city.name;
  };

  const getArea = () => {
    if (property.area) return property.area;
    if (property.square_meters) {
      return typeof property.square_meters === 'string' 
        ? parseFloat(property.square_meters) 
        : property.square_meters;
    }
    return 0;
  };

  // Convert images to PropertyImage format if needed
  const propertyImages: PropertyImage[] = property.images.map((img, index) => {
    if (typeof img === 'string') {
      return {
        id: index,
        url: img,
        alt: property.title,
        order: index,
        is_primary: index === 0,
      };
    }
    return img;
  });

  const features = property.features || property.extra_details || [];
  const hasImages = propertyImages && propertyImages.length > 0;
  const mainImage = hasImages ? propertyImages[selectedImage] : null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Home
            </Link>
            <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <Link href="/properties" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Properties
            </Link>
            <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">
              {property.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Image */}
            <div className="lg:col-span-1">
              {mainImage ? (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={mainImage.url}
                    alt={mainImage.alt || property.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400">No images available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Image Grid */}
            {hasImages && propertyImages.length > 1 && (
              <div className="lg:col-span-1 grid grid-cols-2 gap-4">
                {propertyImages.slice(1, 5).map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index + 1)}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden hover:opacity-80 transition"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${property.title} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {hasImages && propertyImages.length > 5 && (
            <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
              {propertyImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === index 
                      ? 'border-blue-600' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${property.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price */}
            <div>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                  {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                </span>
                <span className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-semibold capitalize">
                  {property.type}
                </span>
                {property.status && (
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                    property.status === 'available' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}>
                    {property.status}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {property.title}
              </h1>

              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{property.address}</p>
                  <p className="text-sm">
                    {property.district && <span>{property.district.name}, </span>}
                    {getCityName()}
                    {property.postal_code && <span>, {property.postal_code}</span>}
                  </p>
                </div>
              </div>

              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(property.price)}
                {property.listing_type === 'rent' && (
                  <span className="text-2xl text-gray-600 dark:text-gray-400 font-normal ml-2">/ month</span>
                )}
              </p>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.bedrooms && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 9.557V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.525 2 13v4a1 1 0 001 1h1v4h2v-4h12v4h2v-4h1a1 1 0 001-1v-4c0-1.475-.81-2.75-2-3.443z"/>
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{property.bedrooms}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</p>
                </div>
              )}
              
              {property.bathrooms && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 10H7V7c0-1.103.897-2 2-2s2 .897 2 2h2c0-2.206-1.794-4-4-4S5 4.794 5 7v3H3a1 1 0 00-1 1v2c0 2.606 1.674 4.823 4 5.65V22h2v-3h8v3h2v-3.35c2.326-.827 4-3.044 4-5.65v-2a1 1 0 00-1-1z"/>
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{property.bathrooms}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</p>
                </div>
              )}

              {getArea() > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 00.707-1.707l-9-9a.999.999 0 00-1.414 0l-9 9A1 1 0 003 13z"/>
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{getArea()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">m² Area</p>
                </div>
              )}

              {property.year_built && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                      <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"/>
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{property.year_built}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Year Built</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                About this property
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                {property.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={feature.id || index} className="flex items-start bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-900 dark:text-white">
                        {feature.name}
                        {feature.value && <span className="text-gray-600 dark:text-gray-400"> • {feature.value}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 sticky top-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Interested in this property?
              </h3>

              {property.agent && (
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    {property.agent.photo ? (
                      <Image
                        src={property.agent.photo}
                        alt={property.agent.name}
                        width={64}
                        height={64}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {property.agent.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900 dark:text-white">{property.agent.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Real Estate Agent</p>
                    </div>
                  </div>
                  {property.agent.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{property.agent.bio}</p>
                  )}
                </div>
              )}

              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <textarea
                  rows={4}
                  placeholder="Message"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                  defaultValue={`I'm interested in ${property.title}`}
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-colors shadow-lg"
                >
                  Send Message
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white py-3 rounded-xl font-semibold transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Property
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
