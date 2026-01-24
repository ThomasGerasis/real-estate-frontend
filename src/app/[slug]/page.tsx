import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageService } from '@/lib/api';

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
        <article className="prose prose-lg max-w-4xl mx-auto">
          <h1>{page.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
