'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cityService, District } from '@/lib/api';

const gradients = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-500',
  'from-cyan-500 to-blue-600',
  'from-rose-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-teal-500 to-emerald-600',
  'from-indigo-500 to-purple-600',
];

function getDistrictImage(district: District): string | null {
  return district.featured_image || district.image || null;
}

export default function DistrictsSection() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const citiesResponse = await cityService.getCities(1, 1);
        const mainCity = citiesResponse.data[0];
        if (!mainCity) return;
        const data = await cityService.getCityDistricts(mainCity.id);
        setDistricts(data.slice(0, 9));
      } catch (error) {
        console.error('Failed to fetch districts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
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

  if (!districts.length) return null;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3 uppercase tracking-wide text-sm">
            Αθήνα
          </p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ακίνητα ανά Περιοχή
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Εξερευνήστε ακίνητα στις καλύτερες περιοχές της Αθήνας
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {districts.map((district, index) => {
            const imgUrl = getDistrictImage(district);
            return (
              <Link
                key={district.id}
                href={`/properties?district_id=${district.id}`}
                className="group relative rounded-2xl overflow-hidden h-56 block"
              >
                {/* Background: real image or gradient fallback */}
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={district.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}`}
                  />
                )}

                {/* Dark overlay — stronger at bottom for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 group-hover:from-black/60 transition-all duration-300" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-1 drop-shadow">{district.name}</h3>
                  {district.properties_count !== undefined && (
                    <p className="text-white/85 text-sm">
                      {district.properties_count} {district.properties_count === 1 ? 'Ακίνητο' : 'Ακίνητα'}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <div className="absolute top-4 right-4">
                  <svg
                    className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Δείτε όλα τα ακίνητα
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

