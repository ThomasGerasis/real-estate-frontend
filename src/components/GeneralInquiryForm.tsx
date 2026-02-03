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
        setCities(data);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Find Your Property
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Tell us what you're looking for and we'll help you find it
        </p>
      </div>

      {/* Property Preferences */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4">
        <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Property Preferences</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City
            </label>
            <select
              id="city_id"
              name="city_id"
              value={formData.city_id}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">Any city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="listing_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              I'm Looking To
            </label>
            <select
              id="listing_type"
              name="listing_type"
              value={formData.listing_type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">Select</option>
              <option value="sale">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          <div>
            <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Property Type
            </label>
            <select
              id="property_type"
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">Any type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bedrooms
            </label>
            <select
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div>
            <label htmlFor="min_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Min Price (€)
            </label>
            <input
              type="number"
              id="min_price"
              name="min_price"
              value={formData.min_price}
              onChange={handleChange}
              min="0"
              step="10000"
              placeholder="No minimum"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="max_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Price (€)
            </label>
            <input
              type="number"
              id="max_price"
              name="max_price"
              value={formData.max_price}
              onChange={handleChange}
              min="0"
              step="10000"
              placeholder="No maximum"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4">
        <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Your Contact Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Surname *
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Details
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us more about what you're looking for..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
          />
        </div>
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
          Thank you! Your inquiry has been received. We'll contact you shortly with matching properties.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
          There was an error submitting your inquiry. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold transition-colors shadow-lg disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  );
}
