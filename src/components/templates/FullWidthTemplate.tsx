import ShortcodeRenderer from '../ShortcodeRenderer';
import { Page } from '@/lib/api';

interface FullWidthTemplateProps {
  page: Page;
}

export default function FullWidthTemplate({ page }: FullWidthTemplateProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Full width hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-6xl font-bold text-center">{page.title}</h1>
        </div>
      </div>

      {/* Full width content - no max-width restrictions */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <ShortcodeRenderer content={page.content} shortcodes={page.shortcodes} />
        </div>
      </div>
    </div>
  );
}
