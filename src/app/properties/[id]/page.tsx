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
    
    // Handle both string arrays and PropertyImage arrays
    const images = Array.isArray(property.images) 
      ? property.images.map((img, index) => {
          if (typeof img === 'string') {
            return {
              url: img,
              alt: property.title,
            };
          }
          return {
            url: img.url,
            alt: img.alt || property.title,
          };
        }).filter((_, index) => index === 0) // Only use first image for OG
      : [];
    
    return {
      title: property.title,
      description: property.description,
      openGraph: {
        title: property.title,
        description: property.description,
        images,
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
