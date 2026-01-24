import Link from 'next/link';

const categories = [
  {
    name: 'Apartments',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 10h6v10h2V9c0-2.206-1.794-4-4-4h-4V3c0-1.103-.897-2-2-2H5C2.794 1 1 2.794 1 5v14h2V5c0-1.103.897-2 2-2h6v17h2v-8z"/>
      </svg>
    ),
    count: 'apartments',
  },
  {
    name: 'Houses',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 00.707-1.707l-9-9a.999.999 0 00-1.414 0l-9 9A1 1 0 003 13zm7 7v-5h4v5h-4zm2-15.586l6 6V19h-2v-5c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v5H6v-8.586l6-6z"/>
      </svg>
    ),
    count: 'house',
  },
  {
    name: 'Villas',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 8h-5L9 2 3 8H1v13h9v-7h4v7h9V8h-3zM7 19H3v-9h4v9zm5-9h4v9h-4v-9zm9 9h-4v-9h4v9z"/>
      </svg>
    ),
    count: 'villa',
  },
  {
    name: 'Land',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 3H3a1 1 0 00-1 1v16a1 1 0 001 1h18a1 1 0 001-1V4a1 1 0 00-1-1zm-1 16H4V5h16v14z"/>
        <path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"/>
      </svg>
    ),
    count: 'land',
  },
  {
    name: 'Commercial',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.9 10.1l-7-7c-.4-.4-.9-.6-1.4-.6s-1 .2-1.4.6l-7 7c-.4.4-.6.9-.6 1.4v9c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9c0-.5-.2-1-.6-1.4zm-8.4 9.4h-3v-5h3v5zm5 0h-3v-7H8.5v7h-3v-8.5l7-7 7 7v8.5z"/>
      </svg>
    ),
    count: 'commercial',
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3 uppercase tracking-wide text-sm">
            Categories
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Best Properties
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover a diverse range of premium properties, from luxurious apartments to spacious villas, tailored to your needs
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/properties?property_type=${category.count}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-400 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-900 dark:border-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
          >
            View All Properties
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
