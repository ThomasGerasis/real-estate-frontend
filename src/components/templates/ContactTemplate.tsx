import ShortcodeRenderer from '../ShortcodeRenderer';
import { Page } from '@/lib/api';
import Image from 'next/image';

interface ContactTemplateProps {
  page: Page;
}

export default function ContactTemplate({ page }: ContactTemplateProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="container max-w-7xl mx-auto px-4  pb-14 md:pb-28">
        {/* Title Section */}
        <div className="mb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
              Have questions? ready to help!
            </h1>
            <p className="text-lg font-normal text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Looking for your dream home or ready to sell? Our expert team offers personalized guidance and market expertise tailored to you.
            </p>
          </div>
        </div>

        {/* Contact Card */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-xl dark:shadow-gray-900/50">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-0">
            {/* Left Side - Contact Info with Image Background */}
            <div className="relative w-full lg:w-[45%] min-h-[500px] lg:min-h-[600px]">
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90 z-10"></div>
                <Image
                  src="/img/hero.png"
                  alt="Contact"
                  fill
                  className="object-cover brightness-50"
                />
              </div>
              
              <div className="relative z-20 p-6 lg:p-12 h-full flex flex-col justify-between text-white">
                {/* Top Content */}
                <div>
                  <h5 className="text-2xl sm:text-3xl font-medium tracking-tight mb-3">
                    Contact information
                  </h5>
                  <p className="text-base sm:text-lg font-normal text-white/80">
                    Ready to find your dream home or sell your property? We&apos;re here to help!
                  </p>
                </div>

                {/* Bottom Content - Contact Details */}
                <div className="flex flex-col gap-6">
                  <a href="tel:+10239031011122" className="flex items-center gap-4 group w-fit hover:opacity-80 transition">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <p className="text-base sm:text-lg font-normal group-hover:text-blue-300 transition">
                      +1 (234) 567-890
                    </p>
                  </a>

                  <a href="mailto:support@example.com" className="flex items-center gap-4 group w-fit hover:opacity-80 transition">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <p className="text-base sm:text-lg font-normal group-hover:text-blue-300 transition">
                      support@example.com
                    </p>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-base sm:text-lg font-normal">
                      123 Main Street, City, State 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="flex-1 p-6 lg:p-12">

              {/* Additional Content from CMS */}
              {page.content && (
                <div className="mt-8">
                  <ShortcodeRenderer content={page.content} shortcodes={page.shortcodes} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Separate client component for the form
function ContactFormClient() {
  return (
    <form className="flex flex-col gap-8">
      {/* Name and Phone Row */}
      <div className="flex flex-col lg:flex-row gap-6">
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name*"
          required
          className="flex-1 px-6 py-4 border border-gray-200 dark:border-gray-700 rounded-full outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
        />
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Phone number*"
          required
          className="flex-1 px-6 py-4 border border-gray-200 dark:border-gray-700 rounded-full outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
        />
      </div>

      {/* Email */}
      <input
        type="email"
        id="email"
        name="email"
        placeholder="Email address*"
        required
        className="px-6 py-4 border border-gray-200 dark:border-gray-700 rounded-full outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
      />

      {/* Message */}
      <textarea
        rows={8}
        name="message"
        id="message"
        placeholder="Write here your message"
        required
        className="px-6 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="px-8 py-4 rounded-full bg-blue-600 text-white text-base font-semibold w-full sm:w-fit hover:bg-gray-900 dark:hover:bg-white dark:hover:text-gray-900 transition-colors duration-300"
      >
        Send message
      </button>
    </form>
  );
}

