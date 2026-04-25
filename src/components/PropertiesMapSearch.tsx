'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { propertyService, cityService, Property, District } from '@/lib/api';

const PropertiesMapLeaflet = dynamic(() => import('./PropertiesMapLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
    </div>
  ),
});

function formatPrice(price: number | string, priceFormatted?: string, listingType?: string) {
  if (priceFormatted) return priceFormatted;
  const num = typeof price === 'string' ? parseFloat(price) : price;
  const formatted = new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(num);
  return listingType === 'rent' ? `${formatted}/μήνα` : formatted;
}

function getArea(p: Property): number {
  if (p.area) return p.area;
  if (p.square_meters)
    return typeof p.square_meters === 'string' ? parseFloat(p.square_meters) : p.square_meters;
  return 0;
}

function getImageUrl(p: Property): string | null {
  if (p.featured_image) return p.featured_image;
  if (p.images && p.images.length > 0) {
    const img = p.images[0];
    return typeof img === 'string' ? img : img.url;
  }
  return null;
}

export default function PropertiesMapSearch() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    listing_type: '',
    property_type: '',
    district_id: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
  });
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    cityService.getCities(1, 1).then((res) => {
      const city = res.data[0];
      if (city) cityService.getCityDistricts(city.id).then(setDistricts);
    });
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = { per_page: 100 };
        if (filters.listing_type) params.listing_type = filters.listing_type;
        if (filters.property_type) params.property_type = filters.property_type;
        if (filters.district_id) params.district_id = parseInt(filters.district_id);
        if (filters.min_price) params.min_price = parseFloat(filters.min_price);
        if (filters.max_price) params.max_price = parseFloat(filters.max_price);
        if (filters.bedrooms) params.bedrooms = parseInt(filters.bedrooms);
        const res = await propertyService.getProperties(params);
        setProperties(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filters]);

  const handleSelect = useCallback((id: number) => {
    setSelectedId(id);
    // On mobile: switch to list view and scroll to card
    setMobileView('list');
    setTimeout(() => {
      const card = cardRefs.current.get(id);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }, []);

  const updateFilter = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () =>
    setFilters({ listing_type: '', property_type: '', district_id: '', min_price: '', max_price: '', bedrooms: '' });

  const hasFilters = Object.values(filters).some(Boolean);
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="flex flex-col h-[calc(100dvh-112px)] lg:h-[calc(100dvh-80px)]">

      {/* ── Filter bar ── */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">

        {/* Mobile: single row with toggle */}
        <div className="flex lg:hidden items-center gap-2 px-3 py-2">
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            {(['', 'sale', 'rent'] as const).map((val) => (
              <button
                key={val}
                onClick={() => updateFilter('listing_type', val)}
                className={`px-3 py-1.5 text-xs font-semibold transition ${
                  filters.listing_type === val
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {val === '' ? 'Όλα' : val === 'sale' ? 'Πώληση' : 'Ενοικίαση'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
              filtersOpen || activeFilterCount > 0
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 text-blue-600 dark:text-blue-400'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Φίλτρα{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </button>
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
            {loading ? '...' : `${properties.length} ακίν.`}
          </span>
        </div>

        {/* Mobile: expandable extra filters */}
        {filtersOpen && (
          <div className="lg:hidden px-3 pb-3 grid grid-cols-2 gap-2">
            <select
              value={filters.property_type}
              onChange={(e) => updateFilter('property_type', e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white col-span-1"
            >
              <option value="">Τύπος ακινήτου</option>
              <option value="apartment">Διαμέρισμα</option>
              <option value="house">Μονοκατοικία</option>
              <option value="villa">Βίλα</option>
              <option value="land">Οικόπεδο</option>
              <option value="commercial">Επαγγελματικός</option>
            </select>
            <select
              value={filters.district_id}
              onChange={(e) => updateFilter('district_id', e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white col-span-1"
            >
              <option value="">Περιοχή</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Τιμή από"
              value={filters.min_price}
              onChange={(e) => updateFilter('min_price', e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              placeholder="Τιμή έως"
              value={filters.max_price}
              onChange={(e) => updateFilter('max_price', e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              value={filters.bedrooms}
              onChange={(e) => updateFilter('bedrooms', e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Υπνοδωμάτια</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-blue-600 dark:text-blue-400 hover:underline text-left px-1">
                Καθαρισμός
              </button>
            )}
          </div>
        )}

        {/* Desktop: single row */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-3 flex-wrap">
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            {(['', 'sale', 'rent'] as const).map((val) => (
              <button
                key={val}
                onClick={() => updateFilter('listing_type', val)}
                className={`px-4 py-2 text-sm font-medium transition ${
                  filters.listing_type === val
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {val === '' ? 'Όλα' : val === 'sale' ? 'Πώληση' : 'Ενοικίαση'}
              </button>
            ))}
          </div>
          <select
            value={filters.property_type}
            onChange={(e) => updateFilter('property_type', e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Τύπος ακινήτου</option>
            <option value="apartment">Διαμέρισμα</option>
            <option value="house">Μονοκατοικία</option>
            <option value="villa">Βίλα</option>
            <option value="land">Οικόπεδο</option>
            <option value="commercial">Επαγγελματικός</option>
          </select>
          <select
            value={filters.district_id}
            onChange={(e) => updateFilter('district_id', e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Περιοχή</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <input
              type="number"
              placeholder="Τιμή από"
              value={filters.min_price}
              onChange={(e) => updateFilter('min_price', e.target.value)}
              className="w-28 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-400">—</span>
            <input
              type="number"
              placeholder="Τιμή έως"
              value={filters.max_price}
              onChange={(e) => updateFilter('max_price', e.target.value)}
              className="w-28 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filters.bedrooms}
            onChange={(e) => updateFilter('bedrooms', e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Υπν/τια</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-auto">
              Καθαρισμός
            </button>
          )}
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
            {loading ? 'Φόρτωση...' : `${properties.length} ακίνητα`}
          </span>
        </div>
      </div>

      {/* ── Mobile tab switcher ── */}
      <div className="flex lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button
          onClick={() => setMobileView('list')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition border-b-2 ${
            mobileView === 'list'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Λίστα
        </button>
        <button
          onClick={() => setMobileView('map')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition border-b-2 ${
            mobileView === 'map'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Χάρτης
        </button>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 min-h-0">

        {/* Property list — full on mobile when list tab active, sidebar on desktop */}
        <div className={`
          flex-shrink-0 overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          w-full lg:w-[420px] xl:w-[480px]
          ${mobileView === 'list' ? 'block' : 'hidden'}
          lg:block
        `}>
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
            </div>
          )}
          {!loading && properties.length === 0 && (
            <div className="text-center py-20 px-4">
              <p className="text-gray-500 dark:text-gray-400">Δεν βρέθηκαν ακίνητα.</p>
            </div>
          )}
          {!loading && properties.map((property) => {
            const imageUrl = getImageUrl(property);
            const area = getArea(property);
            const isSelected = property.id === selectedId;
            return (
              <div
                key={property.id}
                ref={(el) => { if (el) cardRefs.current.set(property.id, el); }}
                onClick={() => setSelectedId(property.id)}
                className={`flex gap-3 p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-l-transparent'
                }`}
              >
                <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={property.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-blue-600 dark:text-blue-400 truncate">
                    {formatPrice(property.price, property.price_formatted, property.listing_type)}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate mt-0.5">
                    {property.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {typeof property.city === 'string' ? property.city : property.city?.name}
                    {property.district ? ` • ${property.district.name}` : ''}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600 dark:text-gray-400">
                    {area > 0 && <span>{area} m²</span>}
                    {property.bedrooms != null && <span>{property.bedrooms} υπν.</span>}
                    {property.bathrooms != null && <span>{property.bathrooms} μπ.</span>}
                  </div>
                </div>
                <Link
                  href={`/properties/${property.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-shrink-0 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Προβολή ακινήτου"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Map — full on mobile when map tab active, fills remaining space on desktop */}
        <div className={`
          flex-1 relative min-h-0
          ${mobileView === 'map' ? 'block' : 'hidden'}
          lg:block
        `}>
          <PropertiesMapLeaflet
            properties={properties}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
          {!properties.some((p) => p.latitude && p.longitude) && !loading && properties.length > 0 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 z-[1000] whitespace-nowrap">
              Τα ακίνητα δεν έχουν συντεταγμένες για εμφάνιση στον χάρτη
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
