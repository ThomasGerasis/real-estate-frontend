import ShortcodeRenderer from '../ShortcodeRenderer';
import { Page } from '@/lib/api';

interface AboutTemplateProps {
  page: Page;
}

export default function AboutTemplate({ page }: AboutTemplateProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">{page.title}</h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Your trusted partner in real estate
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
            <ShortcodeRenderer content={page.content} shortcodes={page.shortcodes} />
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-400">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Properties Sold</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-400">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Expert Agents</div>
            </div>
          </div>

          {/* Mission/Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-gray-700 dark:text-gray-300">
                To provide exceptional real estate services that exceed our clients&apos; expectations through 
                professionalism, expertise, and dedication.
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-gray-700 dark:text-gray-300">
                To be the most trusted and preferred real estate company, known for our integrity, 
                innovation, and commitment to client satisfaction.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">⭐</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Excellence</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We strive for excellence in everything we do
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🤝</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Integrity</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Honesty and transparency guide our actions
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">💡</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Innovation</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We embrace new ideas and technologies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
