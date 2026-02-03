'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cityService, City } from '@/lib/api';

export default function CitiesSection() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await cityService.getCities(1, 6);
        setCities(response.data);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!cities.length) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Properties by Cities
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Aliquam lacinia diam quis lacus euismod
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <Link
              key={city.id}
              href={`/properties?city=${city.slug || city.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group relative rounded-2xl overflow-hidden h-64 block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{city.name}</h3>
                <p className="text-white/90">
                  {city.properties_count || 0} {city.properties_count === 1 ? 'Property' : 'Properties'}
                </p>
              </div>
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
