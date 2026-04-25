'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { cityService, City, District, SubDistrict } from '@/lib/api';

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Location data
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [subdistricts, setSubdistricts] = useState<SubDistrict[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingSubdistricts, setLoadingSubdistricts] = useState(false);

  // Athens city id — resolved once on mount
  const athensCityIdRef = useRef<number | null>(null);

  // Fetch cities + pre-load Athens districts on mount
  useEffect(() => {
    cityService.getCities(1, 100).then((res) => {
      const allCities = res.data;
      setCities(allCities);

      // Find Athens: prefer name match, fallback to first city
      const athens =
        allCities.find((c) =>
          c.name.toLowerCase().includes('αθήν') ||
          c.name.toLowerCase().includes('athens')
        ) || allCities[0];

      if (!athens) return;
      athensCityIdRef.current = athens.id;

      // Auto-set city_id=Athens in URL if not already set
      if (!searchParams.get('city_id')) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('city_id', String(athens.id));
        router.replace(`?${params.toString()}`);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedCityId = searchParams.get('city_id');
  const selectedDistrictId = searchParams.get('district_id');

  // Load districts when city changes
  useEffect(() => {
    if (!selectedCityId) { setDistricts([]); return; }
    setLoadingDistricts(true);
    cityService.getCityDistricts(parseInt(selectedCityId))
      .then(setDistricts)
      .catch(() => setDistricts([]))
      .finally(() => setLoadingDistricts(false));
  }, [selectedCityId]);

  // Load subdistricts when district changes
  useEffect(() => {
    if (!selectedDistrictId) { setSubdistricts([]); return; }
    setLoadingSubdistricts(true);
    cityService.getDistrictSubdistricts(parseInt(selectedDistrictId))
      .then(setSubdistricts)
      .catch(() => setSubdistricts([]))
      .finally(() => setLoadingSubdistricts(false));
  }, [selectedDistrictId]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) { params.set(key, value); } else { params.delete(key); }
    // Cascade clears
    if (key === 'city_id') { params.delete('district_id'); params.delete('subdistrict_id'); }
    if (key === 'district_id') { params.delete('subdistrict_id'); }
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    // Reset to Athens default
    const athensId = athensCityIdRef.current;
    router.push(athensId ? `/properties?city_id=${athensId}` : '/properties');
    setIsOpen(false);
  };

  const hasActiveFilters = (() => {
    const p = new URLSearchParams(searchParams.toString());
    // Athens city_id alone doesn't count as an "active" filter
    if (athensCityIdRef.current && p.get('city_id') === String(athensCityIdRef.current)) {
      p.delete('city_id');
    }
    return p.toString() !== '';
  })();

  const isAthensDefault =
    athensCityIdRef.current !== null &&
    selectedCityId === String(athensCityIdRef.current);

  const filterSelect = 'w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50';
  const filterInput = 'w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <span className="flex items-center gap-2">
            Φίλτρα
            {hasActiveFilters && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-blue-600 text-white rounded-full">
                {new URLSearchParams(searchParams.toString()).size - (selectedCityId ? 1 : 0)}
              </span>
            )}
          </span>
          <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Φίλτρα</h3>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Καθαρισμός
              </button>
            )}
          </div>

          <div className="space-y-6">

            {/* Listing Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Τύπος Καταχώρησης
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['sale', 'rent'] as const).map((val) => {
                  const label = val === 'sale' ? 'Πώληση' : 'Ενοικίαση';
                  const active = searchParams.get('listing_type') === val;
                  return (
                    <button
                      key={val}
                      onClick={() => handleFilterChange('listing_type', active ? '' : val)}
                      className={`px-4 py-2.5 rounded-lg border font-medium text-sm transition ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-600'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Τύπος Ακινήτου
              </label>
              <select
                value={searchParams.get('property_type') || ''}
                onChange={(e) => handleFilterChange('property_type', e.target.value)}
                className={filterSelect}
              >
                <option value="">Όλοι οι τύποι</option>
                <option value="apartment">Διαμέρισμα</option>
                <option value="house">Μονοκατοικία</option>
                <option value="villa">Βίλα</option>
                <option value="land">Οικόπεδο</option>
                <option value="commercial">Επαγγελματικός Χώρος</option>
              </select>
            </div>

            {/* ── Location ── */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Τοποθεσία
              </label>

              {/* City — shown as label if Athens is default */}
              {isAthensDefault ? (
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Αθήνα</span>
                  <button
                    onClick={() => handleFilterChange('city_id', '')}
                    className="ml-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    title="Αλλαγή πόλης"
                  >
                    Αλλαγή
                  </button>
                </div>
              ) : (
                <select
                  value={selectedCityId || ''}
                  onChange={(e) => handleFilterChange('city_id', e.target.value)}
                  className={`${filterSelect} mb-3`}
                >
                  <option value="">Όλες οι πόλεις</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}

              {/* District */}
              {selectedCityId && (
                <select
                  value={selectedDistrictId || ''}
                  onChange={(e) => handleFilterChange('district_id', e.target.value)}
                  className={`${filterSelect} mb-3`}
                  disabled={loadingDistricts}
                >
                  <option value="">{loadingDistricts ? 'Φόρτωση...' : 'Όλες οι περιοχές'}</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              )}

              {/* Sub-district */}
              {selectedDistrictId && subdistricts.length > 0 && (
                <select
                  value={searchParams.get('subdistrict_id') || ''}
                  onChange={(e) => handleFilterChange('subdistrict_id', e.target.value)}
                  className={filterSelect}
                  disabled={loadingSubdistricts}
                >
                  <option value="">{loadingSubdistricts ? 'Φόρτωση...' : 'Όλες οι υποπεριοχές'}</option>
                  {subdistricts.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Εύρος Τιμών
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Ελάχ." defaultValue={searchParams.get('min_price') || ''} onChange={(e) => handleFilterChange('min_price', e.target.value)} className={filterInput} />
                <input type="number" placeholder="Μέγ." defaultValue={searchParams.get('max_price') || ''} onChange={(e) => handleFilterChange('max_price', e.target.value)} className={filterInput} />
              </div>
            </div>

            {/* Square Meters */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Τετραγωνικά Μέτρα
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Ελάχ. m²" defaultValue={searchParams.get('min_area') || ''} onChange={(e) => handleFilterChange('min_area', e.target.value)} className={filterInput} />
                <input type="number" placeholder="Μέγ. m²" defaultValue={searchParams.get('max_area') || ''} onChange={(e) => handleFilterChange('max_area', e.target.value)} className={filterInput} />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Υπνοδωμάτια
              </label>
              <select value={searchParams.get('bedrooms') || ''} onChange={(e) => handleFilterChange('bedrooms', e.target.value)} className={filterSelect}>
                <option value="">Οποιοδήποτε</option>
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
                Μπάνια
              </label>
              <select value={searchParams.get('bathrooms') || ''} onChange={(e) => handleFilterChange('bathrooms', e.target.value)} className={filterSelect}>
                <option value="">Οποιοδήποτε</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Floor */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Όροφος
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Από" defaultValue={searchParams.get('min_floor') || ''} onChange={(e) => handleFilterChange('min_floor', e.target.value)} className={filterInput} />
                <input type="number" placeholder="Έως" defaultValue={searchParams.get('max_floor') || ''} onChange={(e) => handleFilterChange('max_floor', e.target.value)} className={filterInput} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

