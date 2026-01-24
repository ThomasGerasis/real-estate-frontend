import { Metadata } from 'next';
import { postService } from '@/lib/api';
import BlogList from '@/components/BlogList';

export const metadata: Metadata = {
  title: 'Blog - Real Estate News & Tips',
  description: 'Latest real estate news, tips, and market insights',
};

interface BlogPageProps {
  searchParams: {
    category?: string;
    tag?: string;
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const filters = {
    category: searchParams.category,
    tag: searchParams.tag,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    per_page: 12,
  };

  const response = await postService.getPosts(filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <BlogList posts={response.data} pagination={response} />
    </div>
  );
}
