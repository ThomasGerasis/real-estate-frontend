import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { postService } from '@/lib/api';
import Image from 'next/image';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await postService.getPostBySlug(params.slug);
    
    return {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt || '',
        images: post.featured_image ? [{ url: post.featured_image }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await postService.getPostBySlug(params.slug);
    
    return (
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {post.featured_image && (
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-gray-600 mb-4">
            {post.author && <span>By {post.author}</span>}
            <span>•</span>
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {post.category && (
              <>
                <span>•</span>
                <span className="text-blue-600">{post.category}</span>
              </>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {post.excerpt && (
          <p className="text-xl text-gray-700 mb-8 italic">
            {post.excerpt}
          </p>
        )}

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    );
  } catch (error) {
    notFound();
  }
}
