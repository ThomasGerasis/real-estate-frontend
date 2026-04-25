import Image from 'next/image';
import Link from 'next/link';
import ShortcodeRenderer from '../ShortcodeRenderer';
import { Page } from '@/lib/api';

interface AboutTemplateProps {
  page: Page;
}

export default function AboutTemplate({ page }: AboutTemplateProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-700 to-indigo-900 py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <Image src="/img/house-livingroom.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">{page.title}</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Η γνώση και η εμπειρία μας, πάντα δίπλα σας.
          </p>
        </div>
      </div>

      {/* Intro: image grid left + text right */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Image collage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative rounded-2xl h-64 overflow-hidden shadow-md">
                  <Image src="/img/house-livingroom.jpg" loading='lazy' alt="Living room" fill className="object-cover" />
                </div>
                <div className="relative rounded-2xl h-48 overflow-hidden shadow-md">
                  <Image src="/img/house-kicthen.jpg" loading='lazy' alt="Kitchen" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative rounded-2xl h-48 overflow-hidden shadow-md">
                  <Image src="/img/house-neigbourhood.jpg" loading='lazy' alt="Neighbourhood" fill className="object-cover" />
                </div>
                <div className="relative rounded-2xl h-64 overflow-hidden shadow-md">
                  <Image src="/img/real-estate-plan.jpg" loading='lazy' alt="Real estate plan" fill className="object-cover" />
                </div>
              </div>
            </div>

            {/* CMS content */}
            <div>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ShortcodeRenderer content={page.content} shortcodes={page.shortcodes} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-blue-700 py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '10+', label: 'Χρόνια εμπειρίας' },
              { value: '1.000+', label: 'Ακίνητα' },
              { value: '1.000+', label: 'Ευχαριστημένοι πελάτες' },
              { value: '2+', label: 'Εξειδικευμένοι σύμβουλοι' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-bold mb-2">{s.value}</div>
                <div className="text-blue-100 text-sm uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Οι Υπηρεσίες μας
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '🏠', title: 'Πωλήσεις & Μισθώσεις Κατοικιών', desc: 'Εύρεση και προώθηση κατοικιών με απόλυτο επαγγελματισμό.' },
              { icon: '🏢', title: 'Επαγγελματικά Ακίνητα', desc: 'Βοήθεια στην αγορά ή μίσθωση γραφείων και καταστημάτων.' },
              { icon: '🌿', title: 'Πωλήσεις Οικοπέδων', desc: 'Αξιολόγηση και προώθηση οικοπέδων για κατασκευαστικές χρήσεις.' },
              { icon: '📊', title: 'Εκτίμηση Ακινήτων', desc: 'Αξιόπιστες εκτιμήσεις βασισμένες σε ανάλυση αγοράς.' },
              { icon: '🔨', title: 'Ανακαινίσεις', desc: 'Αναβαθμίστε το ακίνητό σας με τις υπηρεσίες ανακαίνισης.' },
              { icon: '⚖️', title: 'Νομικές Υπηρεσίες', desc: 'Εξειδικευμένοι δικηγόροι για απόλυτη ασφάλεια συναλλαγών.' },
            ].map((s) => (
              <div key={s.title} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values: text left + image right */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Οι Αξίες μας</h2>
              <div className="space-y-5">
                {[
                  { icon: '⭐', title: 'Αριστεία', desc: 'Επιδιώκουμε την αριστεία σε κάθε τι που κάνουμε.' },
                  { icon: '🤝', title: 'Εμπιστοσύνη', desc: 'Εντιμότητα και διαφάνεια καθοδηγούν κάθε μας βήμα.' },
                  { icon: '💡', title: 'Καινοτομία', desc: 'Αγκαλιάζουμε νέες ιδέες και τεχνολογίες για να σας εξυπηρετήσουμε καλύτερα.' },
                ].map((v) => (
                  <div key={v.title} className="flex gap-4 items-start">
                    <div className="text-3xl flex-shrink-0">{v.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">{v.title}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl h-96 overflow-hidden shadow-lg">
              <Image src="/img/house-neigbourhood.jpg" loading='lazy' alt="Our values" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Επικοινωνήστε μαζί μας</h2>
          <p className="text-indigo-200 mb-8 max-w-xl mx-auto">
          Επικοινωνήστε μαζί μας για οποιαδήποτε ερώτηση ή αίτημα έχετε, μέσω της φόρμας επικοινωνίας. Το αίτημά σας θα προωθηθεί στον υπεύθυνο του γραφείου μας και θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-indigo-900 hover:bg-indigo-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
          >
            Στείλτε μήνυμα
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
}
