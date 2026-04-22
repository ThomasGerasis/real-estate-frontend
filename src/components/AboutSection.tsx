import Link from 'next/link';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative rounded-2xl h-64 overflow-hidden">
                  <Image src="/img/house-livingroom.jpg" alt="Living room" fill className="object-cover" />
                </div>
                <div className="relative rounded-2xl h-48 overflow-hidden">
                  <Image src="/img/house-kicthen.jpg" alt="Kitchen" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative rounded-2xl h-48 overflow-hidden">
                  <Image src="/img/house-neigbourhood.jpg" alt="Neighbourhood" fill className="object-cover" />
                </div>
                <div className="relative rounded-2xl h-64 overflow-hidden">
                  <Image src="/img/real-estate-plan.jpg" alt="Real estate plan" fill className="object-cover" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ας βρούμε τη σωστή επιλογή για εσάς
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Με σύγχρονη εμπειρία και αξιόπιστη παρουσία στην αγορά ακινήτων
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-lg">Βρείτε εξαιρετικές προσφορές</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-lg">Φιλική εξυπηρέτηση & Γρήγορη υποστήριξη</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-lg">Καταχωρήστε το δικό σας ακίνητο</span>
              </li>
            </ul>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              Μάθετε Περισσότερα
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
