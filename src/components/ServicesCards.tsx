import Link from 'next/link';

export default function ServicesCards() {
  const services = [
    {
      title: 'Buy a property',
      description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 12h3v9h6v-6h2v6h6v-9h3L12 2z" />
        </svg>
      ),
      link: '/properties?type=sale',
      linkText: 'Find a home',
    },
    {
      title: 'Sell a property',
      description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 7h-6V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2H3a1 1 0 000 2h1v11a2 2 0 002 2h12a2 2 0 002-2V9h1a1 1 0 000-2zM11 5h2v2h-2V5zm7 15H6V9h12v11z" />
        </svg>
      ),
      link: '/properties',
      linkText: 'Place an ad',
    },
    {
      title: 'Rent a property',
      description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.41 8.64l-9-6.76a1 1 0 00-1.22 0l-9 6.76a1 1 0 00-.19 1.4 1 1 0 001.4.19L4 9.67V21a1 1 0 001 1h14a1 1 0 001-1V9.67l.59.56a1 1 0 001.41-.19 1 1 0 00-.19-1.4zM18 20H6V8.11l6-4.5 6 4.5z" />
        </svg>
      ),
      link: '/properties?type=rent',
      linkText: 'Find a rental',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            See How Realton Can Help
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Aliquam lacinia diam quis lacus euismod
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl text-center hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-6">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {service.description}
              </p>
              <Link
                href={service.link}
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all"
              >
                {service.linkText}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
