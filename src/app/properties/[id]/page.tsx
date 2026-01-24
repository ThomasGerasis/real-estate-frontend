import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { propertyService } from '@/lib/api';
import PropertyDetail from '@/components/PropertyDetail';

interface PropertyPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  try {
    const id = parseInt(params.id);
    const property = await propertyService.getPropertyById(id);
    
    return {
      title: property.title,
      description: property.description,
      openGraph: {
        title: property.title,
        description: property.description,
        images: property.images.filter(img => img.is_primary).map(img => ({
          url: img.url,
          alt: img.alt || property.title,
        })),
      },
    };
  } catch (error) {
    return {
      title: 'Property Not Found',
    };
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  try {
    const id = parseInt(params.id);
    const property = await propertyService.getPropertyById(id);
    
    return <PropertyDetail property={property} />;
  } catch (error) {
    notFound();
  }
}
