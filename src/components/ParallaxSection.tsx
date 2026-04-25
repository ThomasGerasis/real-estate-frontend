import Link from 'next/link';

const cards = [
  {
    title: 'Ανάθεση',
    description:
      'Εάν ενδιαφέρεστε να αναθέσετε το ακίνητό σας στο μεσιτικό γραφείο μας, συμπληρώστε την παρακάτω φόρμα και θα επικοινωνήσουμε μαζί σας.',
    link: '/anathesi',
    linkText: 'ΦΟΡΜΑ ΑΝΑΘΕΣΗΣ',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
  },
  {
    title: 'Ζήτηση',
    description:
      'Αν ψάχνετε να αγοράσετε ή να νοικιάσετε ένα ακίνητο, συμπληρώστε τη φόρμα ζήτησης ακινήτου και θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.',
    link: '/zitisi',
    linkText: 'ΦΟΡΜΑ ΖΗΤΗΣΗΣ',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
];

export default function ParallaxSection() {
  return (
    <section
      className="relative py-24"
      style={{
        backgroundImage: "url('/img/signing-papers.jpg')",
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-white hover:bg-white/15 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-light tracking-wide">{card.title}</h3>
                <span className="opacity-70">{card.icon}</span>
              </div>

              <p className="text-white/80 text-sm leading-relaxed mb-8">
                {card.description}
              </p>

              <Link
                href={card.link}
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors group"
              >
                {card.linkText}
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
