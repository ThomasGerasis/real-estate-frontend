'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cityService } from '@/lib/api';

export default function HeroSearchSection() {
  const router = useRouter();
  const [cities, setCities] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    listing_type: 'sale',
    property_type: '',
    city_id: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
  });

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await cityService.getCities();
        setCities(response.data || []);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/img/hero-background.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-purple-900/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Title */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Βρείτε το Ιδανικό σας Ακίνητο
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Χιλιάδες ακίνητα σε όλη την Ελλάδα περιμένουν να γίνουν το επόμενο σας σπίτι
          </p>
        </div>

        {/* Search Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 md:p-8">
            {/* Listing Type Toggle */}
            <div className="flex gap-2 mb-6 justify-center">
              <button
                onClick={() => setFilters({ ...filters, listing_type: 'sale' })}
                className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-semibold transition-all ${
                  filters.listing_type === 'sale'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Αγορά
              </button>
              <button
                onClick={() => setFilters({ ...filters, listing_type: 'rent' })}
                className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-semibold transition-all ${
                  filters.listing_type === 'rent'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Ενοικίαση
              </button>
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Τύπος Ακινήτου
                </label>
                <select
                  value={filters.property_type}
                  onChange={(e) => setFilters({ ...filters, property_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="">Όλοι οι τύποι</option>
                  <option value="apartment">Διαμέρισμα</option>
                  <option value="house">Μονοκατοικία</option>
                  <option value="villa">Βίλα</option>
                  <option value="land">Οικόπεδο</option>
                  <option value="commercial">Επαγγελματικός Χώρος</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Πόλη
                </label>
                <select
                  value={filters.city_id}
                  onChange={(e) => setFilters({ ...filters, city_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="">Όλες οι πόλεις</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Τιμή (€)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Από"
                    value={filters.min_price}
                    onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Έως"
                    value={filters.max_price}
                    onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Υπνοδωμάτια
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="">Οποιοδήποτε</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Αναζήτηση Ακινήτων
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">1,200+</div>
            <div className="text-white/80 text-sm md:text-base">Ακίνητα</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">50+</div>
            <div className="text-white/80 text-sm md:text-base">Πόλεις</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">500+</div>
            <div className="text-white/80 text-sm md:text-base">Ικανοποιημένοι Πελάτες</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">15+</div>
            <div className="text-white/80 text-sm md:text-base">Χρόνια Εμπειρίας</div>
          </div>
        </div>
      </div>
    </section>
  );
}
