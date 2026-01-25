import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageService } from '@/lib/api';
import ShortcodeRenderer from '@/components/ShortcodeRenderer';

interface DynamicPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  try {
    const page = await pageService.getPageBySlug(params.slug);
    
    return {
      title: page.meta_title || page.title,
      description: page.meta_description || page.content.substring(0, 160),
    };
  } catch (error) {
    return {
      title: 'Page Not Found',
    };
  }
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  try {
    const page = await pageService.getPageBySlug(params.slug);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">{page.title}</h1>
          <ShortcodeRenderer content={page.content} shortcodes={page.shortcodes} />
        </article>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
