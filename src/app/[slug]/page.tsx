import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageService } from '@/lib/api';
import ContactTemplate from '@/components/templates/ContactTemplate';
import AboutTemplate from '@/components/templates/AboutTemplate';
import FullWidthTemplate from '@/components/templates/FullWidthTemplate';
import DefaultTemplate from '@/components/templates/DefaultTemplate';

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
    
    // Render based on template
    switch (page.template) {
      case 'contact':
        return <ContactTemplate page={page} />;
      
      case 'about':
        return <AboutTemplate page={page} />;
      
      case 'full-width':
        return <FullWidthTemplate page={page} />;
      
      case 'default':
      default:
        return <DefaultTemplate page={page} />;
    }
  } catch (error) {
    notFound();
  }
}
