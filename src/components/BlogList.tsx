'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Post, PaginatedResponse } from '@/lib/api';

interface BlogListProps {
  posts: Post[];
  pagination?: PaginatedResponse<Post>;
}

export default function BlogList({ posts, pagination }: BlogListProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            {post.featured_image && (
              <div className="relative aspect-video">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            )}

            <div className="p-6">
              {post.category && (
                <span className="text-sm text-blue-600 font-semibold mb-2 block">
                  {post.category}
                </span>
              )}

              <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                {post.author && <span>{post.author}</span>}
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`?page=${page}`}
              className={`px-4 py-2 rounded ${
                page === pagination.current_page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
