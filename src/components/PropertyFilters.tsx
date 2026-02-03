'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cityService, City } from '@/lib/api';

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await cityService.getCities(1, 100);
        setCities(response.data);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    
    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/properties');
    setIsOpen(false);
  };

  const hasActiveFilters = searchParams.toString() !== '';

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <span>Filters</span>
          <svg 
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Listing Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Listing Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleFilterChange('type', searchParams.get('type') === 'sale' ? '' : 'sale')}
                  className={`px-4 py-2.5 rounded-lg border font-medium text-sm transition ${
                    searchParams.get('type') === 'sale'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400'
                  }`}
                >
                  For Sale
                </button>
                <button
                  onClick={() => handleFilterChange('type', searchParams.get('type') === 'rent' ? '' : 'rent')}
                  className={`px-4 py-2.5 rounded-lg border font-medium text-sm transition ${
                    searchParams.get('type') === 'rent'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400'
                  }`}
                >
                  For Rent
                </button>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Property Type
              </label>
              <select
                defaultValue={searchParams.get('property_type') || ''}
                onChange={(e) => handleFilterChange('property_type', e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                City
              </label>
              <select
                defaultValue={searchParams.get('city_id') || ''}
                onChange={(e) => handleFilterChange('city_id', e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loadingCities}
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="Min"
                    defaultValue={searchParams.get('min_price') || ''}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max"
                    defaultValue={searchParams.get('max_price') || ''}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Square Meters Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Square Meters
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="Min m²"
                    defaultValue={searchParams.get('min_area') || ''}
                    onChange={(e) => handleFilterChange('min_area', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max m²"
                    defaultValue={searchParams.get('max_area') || ''}
                    onChange={(e) => handleFilterChange('max_area', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Bedrooms
              </label>
              <select
                defaultValue={searchParams.get('bedrooms') || ''}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Bathrooms
              </label>
              <select
                defaultValue={searchParams.get('bathrooms') || ''}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Floor Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Floor
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="From"
                    defaultValue={searchParams.get('min_floor') || ''}
                    onChange={(e) => handleFilterChange('min_floor', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="To"
                    defaultValue={searchParams.get('max_floor') || ''}
                    onChange={(e) => handleFilterChange('max_floor', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
