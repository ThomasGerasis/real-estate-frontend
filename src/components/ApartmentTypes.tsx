export default function ApartmentTypes() {
  const types = [
    { name: 'Studio', icon: '🏢', count: 125 },
    { name: '1 Bedroom', icon: '🏠', count: 234 },
    { name: '2 Bedrooms', icon: '🏡', count: 456 },
    { name: '3 Bedrooms', icon: '🏘️', count: 189 },
    { name: 'Penthouse', icon: '✨', count: 67 },
    { name: 'Villa', icon: '🏰', count: 98 },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Apartment Types
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Get some Inspirations from 1800+ skills
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {types.map((type) => (
            <div
              key={type.name}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center hover:shadow-lg transition-all cursor-pointer border border-gray-100 dark:border-gray-700"
            >
              <div className="text-4xl mb-3">{type.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{type.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{type.count} Properties</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
