'use client';

import { useState, useEffect } from 'react';
import { cityService } from '@/lib/api';
import { formService } from '@/lib/api/services/formService';

export default function GeneralInquiryForm() {
  const [cities, setCities] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    city_id: '',
    listing_type: '',
    property_type: '',
    bedrooms: '',
    min_price: '',
    max_price: '',
    name: '',
    surname: '',
    email: '',
    phone: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await cityService.getCities();
        setCities(data.data || []);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await formService.submitGeneralInquiry(formData);
      setSubmitStatus('success');
      setFormData({
        city_id: '',
        listing_type: '',
        property_type: '',
        bedrooms: '',
        min_price: '',
        max_price: '',
        name: '',
        surname: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl px-8 py-12 mb-8 text-white">
        <h2 className="text-3xl font-bold mb-3">Βρείτε το Ακίνητό σας</h2>
        <p className="text-purple-100 text-lg leading-relaxed max-w-2xl">
          Πείτε μας τι ψάχνετε και θα σας βοηθήσουμε να το βρείτε
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold flex-shrink-0">1</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Σκοπός &amp; Περιοχή</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className={labelClass}>Ψάχνω για</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, listing_type: 'sale' })}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all border-2 ${
                    formData.listing_type === 'sale'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                  }`}
                >
                  Αγορά
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, listing_type: 'rent' })}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all border-2 ${
                    formData.listing_type === 'rent'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                  }`}
                >
                  Ενοικίαση
                </button>
              </div>
              {/* Hidden input to carry listing_type value for form validity */}
              <input type="hidden" name="listing_type" value={formData.listing_type} />
            </div>

            <div>
              <label htmlFor="city_id" className={labelClass}>Περιοχή</label>
              <select id="city_id" name="city_id" value={formData.city_id} onChange={handleChange} className={inputClass}>
                <option value="">Οποιαδήποτε πόλη</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold flex-shrink-0">2</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Χαρακτηριστικά Ακινήτου</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="property_type" className={labelClass}>Είδος</label>
              <select id="property_type" name="property_type" value={formData.property_type} onChange={handleChange} className={inputClass}>
                <option value="">Οποιοσδήποτε τύπος</option>
                <option value="apartment">Διαμέρισμα</option>
                <option value="house">Μονοκατοικία</option>
                <option value="villa">Βίλα</option>
                <option value="land">Οικόπεδο</option>
                <option value="commercial">Επαγγελματικός Χώρος</option>
              </select>
            </div>

            <div>
              <label htmlFor="bedrooms" className={labelClass}>Υπνοδωμάτια</label>
              <select id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className={inputClass}>
                <option value="">Οποιοδήποτε</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div>
              <label htmlFor="min_price" className={labelClass}>Τιμή από (€)</label>
              <input type="number" id="min_price" name="min_price" value={formData.min_price} onChange={handleChange} min="0" step="10000" placeholder="Χωρίς ελάχιστο" className={inputClass} />
            </div>

            <div>
              <label htmlFor="max_price" className={labelClass}>Τιμή έως (€)</label>
              <input type="number" id="max_price" name="max_price" value={formData.max_price} onChange={handleChange} min="0" step="10000" placeholder="Χωρίς μέγιστο" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold flex-shrink-0">3</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Στοιχεία Επικοινωνίας</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className={labelClass}>Όνομα *</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
            </div>

            <div>
              <label htmlFor="surname" className={labelClass}>Επώνυμο *</label>
              <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} required className={inputClass} />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>Email *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>Τηλέφωνο *</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="message" className={labelClass}>Πρόσθετες Πληροφορίες</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Πείτε μας περισσότερα για το τι ψάχνετε..."
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {submitStatus === 'success' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-5 py-4 rounded-xl flex gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Ευχαριστούμε! Το ερώτημά σας έχει ληφθεί. Θα επικοινωνήσουμε σύντομα με ταιριαστά ακίνητα.</span>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-5 py-4 rounded-xl">
            Παρουσιάστηκε σφάλμα. Παρακαλώ δοκιμάστε ξανά.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold transition-colors shadow-lg disabled:cursor-not-allowed text-base"
        >
          {isSubmitting ? 'Υποβολή...' : 'Υποβολή Ερωτήματος'}
        </button>
      </form>
    </div>
  );
}
