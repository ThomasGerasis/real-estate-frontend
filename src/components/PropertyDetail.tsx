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
  const [isSliderOpen, setIsSliderOpen] = useState(false);

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

  const area = getArea();
  const pricePerSqft = area > 0 ? (typeof property.price === 'string' ? parseFloat(property.price) : property.price) / area : 0;

  // Convert images to PropertyImage format and prepend featured_image
  let allImages: string[] = [];
  
  // Add featured image first if it exists
  if (property.featured_image) {
    allImages.push(property.featured_image);
  }
  
  // Then add other images
  if (property.images && property.images.length > 0) {
    const imageUrls = property.images.map(img => typeof img === 'string' ? img : img.url);
    // Filter out featured_image if it's also in the images array to avoid duplicates
    const uniqueImages = imageUrls.filter(url => url !== property.featured_image);
    allImages = [...allImages, ...uniqueImages];
  }

  const propertyImages: PropertyImage[] = allImages.map((url, index) => ({
    id: index,
    url,
    alt: property.title,
    order: index,
    is_primary: index === 0,
  }));

  const features = property.features || [];
  const hasImages = propertyImages && propertyImages.length > 0;
  const mainImage = hasImages ? propertyImages[selectedImage] : null;

  const openSlider = (index: number) => {
    setSelectedImage(index);
    setIsSliderOpen(true);
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Title and Price */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {property.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                {property.address}, {getCityName()}
              </p>
            </div>
            <div className="md:text-right">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-500 mb-1">
                {formatPrice(property.price)}
              </div>
              {pricePerSqft > 0 && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  ${pricePerSqft.toFixed(2)}/sq ft
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-4 py-4">
        {/* Mobile: Single Image with Navigation Arrows */}
        <div className="md:hidden">
          {mainImage ? (
            <div className="relative">
              <button 
                onClick={() => openSlider(selectedImage)}
                className="relative aspect-[16/10] rounded-2xl overflow-hidden w-full cursor-pointer"
              >
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt || property.title}
                  fill
                  className="object-cover"
                  priority
                />
              </button>
              
              {/* Navigation Arrows */}
              {propertyImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg transition z-10"
                  >
                    <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg transition z-10"
                  >
                    <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              {propertyImages.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {propertyImages.length}
                </div>
              )}
            </div>
          ) : (
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">No images available</p>
              </div>
            </div>
          )}
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid grid-cols-4 gap-4">
          {/* Main Large Image */}
          <div className="col-span-4 md:col-span-3">
            {mainImage ? (
              <button 
                onClick={() => openSlider(selectedImage)}
                className="relative aspect-[16/10] rounded-2xl overflow-hidden w-full cursor-pointer group"
              >
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt || property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg">
                    <span className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                      View all {propertyImages.length} photos
                    </span>
                  </div>
                </div>
              </button>
            ) : (
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">No images available</p>
                </div>
              </div>
            )}
          </div>

          {/* Side Grid Images */}
          {hasImages && propertyImages.length > 1 && (
            <div className="col-span-4 md:col-span-1 grid grid-rows-2 gap-4">
              {propertyImages.slice(1, 5).map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => openSlider(index + 1)}
                  className="relative aspect-video md:aspect-auto md:h-full rounded-xl overflow-hidden hover:opacity-80 transition group"
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${property.title} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                  {index === 3 && propertyImages.length > 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-lg md:text-xl font-bold">+{propertyImages.length - 5}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Slider Modal */}
      {isSliderOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeSlider}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm z-10">
            {selectedImage + 1} / {propertyImages.length}
          </div>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-16">
            <div className="relative w-full h-full">
              <Image
                src={propertyImages[selectedImage].url}
                alt={propertyImages[selectedImage].alt || property.title}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-4xl px-4 z-10">
            {propertyImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                  index === selectedImage ? 'border-blue-500' : 'border-transparent hover:border-white/50'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {property.bedrooms && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 9.557V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.525 2 13v4a1 1 0 001 1h1v4h2v-4h12v4h2v-4h1a1 1 0 001-1v-4c0-1.475-.81-2.75-2-3.443zM18 7v2.127c-.315-.083-.652-.127-1-.127s-.685.044-1 .127V7h2zM4 13c0-1.103.897-2 2-2s2 .897 2 2H4zm14 0c0-1.103.897-2 2-2s2 .897 2 2h-4z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Bedroom</p>
                      <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{property.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 10H7V7c0-1.103.897-2 2-2s2 .897 2 2h2c0-2.206-1.794-4-4-4S5 4.794 5 7v3H3a1 1 0 00-1 1v2c0 2.606 1.674 4.823 4 5.65V22h2v-3h8v3h2v-3.35c2.326-.827 4-3.044 4-5.65v-2a1 1 0 00-1-1z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Bath</p>
                      <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{property.bathrooms}</p>
                    </div>
                  </div>
                )}
                {property.year_built && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                        <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Year Built</p>
                      <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{property.year_built}</p>
                    </div>
                  </div>
                )}
                {area > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 00.707-1.707l-9-9a.999.999 0 00-1.414 0l-9 9A1 1 0 003 13z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Sqft</p>
                      <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{area}</p>
                    </div>
                  </div>
                )}
                {property.garage && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 19.723V21a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-1.277A1.99 1.99 0 0022 18v-3c0-.831-.507-1.542-1.228-1.845l-1.368-4.104A2.995 2.995 0 0016.559 7H7.441a2.995 2.995 0 00-2.845 2.051l-1.368 4.104A2.001 2.001 0 002 15v3c0 .738.404 1.376 1 1.723zM5.5 18a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm13 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM7.441 9h9.117a1 1 0 01.949.684L18.613 13H5.387l1.105-3.316A1 1 0 017.441 9z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Garage</p>
                      <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{property.garage}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 3H4a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1zM9 9H5V5h4v4zm11-6h-6a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1zm-1 6h-4V5h4v4zm-9 4H4a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1v-6a1 1 0 00-1-1zm-1 6H5v-4h4v4zm8-6c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Property Type</p>
                    <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white capitalize">{property.type}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Property Description</h2>
              <div className="prose prose-sm md:prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                {property.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Property ID</span>
                  <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">RT{property.id}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Price</span>
                  <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{formatPrice(property.price)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Property Size</span>
                  <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{area} Sq Ft</span>
                </div>
                {property.bathrooms && (
                  <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Bathrooms</span>
                    <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{property.bathrooms}</span>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Bedrooms</span>
                    <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{property.bedrooms}</span>
                  </div>
                )}
                {property.year_built && (
                  <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Year Built</span>
                    <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{property.year_built}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Property Type</span>
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">{property.type}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Property Status</span>
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">
                    {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Address</p>
                  <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{property.address}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">City</p>
                  <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{getCityName()}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">State/county</p>
                  <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{property.country || 'N/A'}</p>
                </div>
                {property.postal_code && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Zip/Postal Code</p>
                    <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{property.postal_code}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Features & Amenities */}
            {features.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {features.map((feature, index) => (
                    <div key={feature.id || index} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Details */}
            {property.extra_details && Object.keys(property.extra_details).length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Additional Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(property.extra_details).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">
                        {key}: <span className="font-semibold">{String(value)}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Energy Class */}
            {property.energy_class && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Energy Class</h2>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-2">
                      {['A+', 'A', 'B', 'C', 'D', 'E', 'F'].map((grade) => (
                        <div
                          key={grade}
                          className={`px-3 py-1 rounded text-sm font-bold ${
                            grade === property.energy_class?.toUpperCase()
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {grade}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
                    Energy Efficiency: <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{property.energy_class?.toUpperCase()}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8 sticky top-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
                Get More Information
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
                      <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{property.agent.name}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">5.0 · 3 reviews</span>
                      </div>
                    </div>
                  </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
