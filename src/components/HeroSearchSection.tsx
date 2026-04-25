'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cityService, District, SubDistrict } from '@/lib/api';

export default function HeroSearchSection() {
  const router = useRouter();
  const [districts, setDistricts] = useState<District[]>([]);
  const [subdistricts, setSubdistricts] = useState<SubDistrict[]>([]);
  const [athensCityId, setAthensCityId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    listing_type: 'sale',
    property_type: '',
    district_id: '',
    subdistrict_id: '',
    min_price: '',
    max_price: '',
    min_area: '',
    max_area: '',
    bedrooms: '',
  });

  // Fetch Athens districts on mount
  useEffect(() => {
    cityService.getCities(1, 100).then((res) => {
      const athens =
        res.data.find((c) =>
          c.name.toLowerCase().includes('αθήν') || c.name.toLowerCase().includes('athens')
        ) || res.data[0];
      if (!athens) return;
      setAthensCityId(athens.id);
      cityService.getCityDistricts(athens.id).then(setDistricts);
    });
  }, []);

  // Fetch subdistricts when district changes
  useEffect(() => {
    if (!filters.district_id) { setSubdistricts([]); return; }
    cityService.getDistrictSubdistricts(parseInt(filters.district_id))
      .then(setSubdistricts)
      .catch(() => setSubdistricts([]));
  }, [filters.district_id]);

  const set = (key: string, value: string) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'district_id') next.subdistrict_id = '';
      return next;
    });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (athensCityId) params.set('city_id', String(athensCityId));
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    router.push(`/properties?${params.toString()}`);
  };

  const selectCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm';
  const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm placeholder-gray-400';

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/img/house-kicthen.jpg")' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-purple-900/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Βρείτε το Ιδανικό σας Ακίνητο στην Αθήνα
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Εκατοντάδες ακίνητα στις καλύτερες περιοχές της Αθήνας περιμένουν εσάς
          </p>
        </div>

        {/* Search Card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 md:p-7">

            {/* Listing type tabs */}
            <div className="flex gap-2 mb-5">
              {(['sale', 'rent'] as const).map((val) => (
                <button
                  key={val}
                  onClick={() => set('listing_type', val)}
                  className={`flex-1 md:flex-none px-8 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    filters.listing_type === val
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {val === 'sale' ? 'Αγορά' : 'Ενοικίαση'}
                </button>
              ))}
            </div>

            {/* Row 1: Property type | District | Sub-district | Bedrooms */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${subdistricts.length > 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-3 mb-3`}>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Τύπος Ακινήτου</label>
                <select value={filters.property_type} onChange={(e) => set('property_type', e.target.value)} className={selectCls}>
                  <option value="">Όλοι οι τύποι</option>
                  <option value="apartment">Διαμέρισμα</option>
                  <option value="house">Μονοκατοικία</option>
                  <option value="villa">Βίλα</option>
                  <option value="land">Οικόπεδο</option>
                  <option value="commercial">Επαγγελματικός Χώρος</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Περιοχή</label>
                <select value={filters.district_id} onChange={(e) => set('district_id', e.target.value)} className={selectCls}>
                  <option value="">Όλες οι περιοχές</option>
                  {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              {subdistricts.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Υποπεριοχή</label>
                  <select value={filters.subdistrict_id} onChange={(e) => set('subdistrict_id', e.target.value)} className={selectCls}>
                    <option value="">Όλες οι υποπεριοχές</option>
                    {subdistricts.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Υπνοδωμάτια</label>
                <select value={filters.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} className={selectCls}>
                  <option value="">Οποιοδήποτε</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
            </div>

            {/* Row 2: Price from | Price to | Area from | Area to */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Τιμή από (€)</label>
                <input type="number" placeholder="π.χ. 50.000" value={filters.min_price} onChange={(e) => set('min_price', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Τιμή έως (€)</label>
                <input type="number" placeholder="π.χ. 300.000" value={filters.max_price} onChange={(e) => set('max_price', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Εμβαδόν από (m²)</label>
                <input type="number" placeholder="π.χ. 50" value={filters.min_area} onChange={(e) => set('min_area', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Εμβαδόν έως (m²)</label>
                <input type="number" placeholder="π.χ. 200" value={filters.max_area} onChange={(e) => set('max_area', e.target.value)} className={inputCls} />
              </div>
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Αναζήτηση Ακινήτων
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { value: '1,200+', label: 'Ακίνητα' },
            { value: '50+', label: 'Περιοχές' },
            { value: '500+', label: 'Ικανοποιημένοι Πελάτες' },
            { value: '15+', label: 'Χρόνια Εμπειρίας' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-white/80 text-sm md:text-base">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

