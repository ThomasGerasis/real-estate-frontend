import Link from 'next/link';
import { propertyService } from '@/lib/api';

const TYPE_META: Record<string, { icon: string; label: string }> = {
  apartment:  { icon: '🏢', label: 'Διαμέρισμα' },
  house:      { icon: '🏠', label: 'Μονοκατοικία' },
  villa:      { icon: '🏰', label: 'Βίλα' },
  land:       { icon: '🌳', label: 'Οικόπεδο' },
  commercial: { icon: '🏪', label: 'Επαγγελματικός Χώρος' },
  penthouse:  { icon: '✨', label: 'Ρετιρέ' },
  studio:     { icon: '🛋️', label: 'Στούντιο' },
};

export default async function ApartmentTypes() {
  let types: { type: string; count: number }[] = [];

  try {
    types = await propertyService.getTypeCounts();
  } catch (error) {
    console.error('Failed to fetch property type counts:', error);
  }

  if (!types || types.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Εξερευνήστε Τύπους Ακινήτων
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Περιηγηθείτε στα ακίνητα ανά τύπο
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {types.map(({ type, count }) => {
            const meta = TYPE_META[type.toLowerCase()] ?? { icon: '🏗️', label: type };
            return (
              <Link
                key={type}
                href={`/properties?property_type=${type}`}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center hover:shadow-lg transition-all cursor-pointer border border-gray-100 dark:border-gray-700"
              >
                <div className="text-4xl mb-3">{meta.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 capitalize">{meta.label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{count} Ακίνητα</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
