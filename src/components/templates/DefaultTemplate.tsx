import ShortcodeRenderer from '../ShortcodeRenderer';
import { Page } from '@/lib/api';

interface DefaultTemplateProps {
  page: Page;
}

export default function DefaultTemplate({ page }: DefaultTemplateProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-8">
            {page.title}
          </h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ShortcodeRenderer content={page.content} shortcodes={page.shortcodes} />
          </div>
        </article>
      </div>
    </div>
  );
}
