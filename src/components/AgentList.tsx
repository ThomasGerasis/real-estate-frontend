'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Agent, PaginatedResponse } from '@/lib/api';

interface AgentListProps {
  agents: Agent[];
  pagination?: PaginatedResponse<Agent>;
}

export default function AgentList({ agents, pagination }: AgentListProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent) => (
          <Link
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="group block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition text-center"
          >
            {agent.avatar ? (
              <div className="relative aspect-square">
                <Image
                  src={agent.avatar}
                  alt={agent.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-6xl font-bold text-white">
                  {agent.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="p-6">
              <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 transition">
                {agent.name}
              </h3>

              {agent.position && (
                <p className="text-blue-600 text-sm mb-3">{agent.position}</p>
              )}

              {agent.bio && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {agent.bio}
                </p>
              )}

              <div className="space-y-2 text-sm text-gray-600">
                {agent.email && (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="truncate">{agent.email}</span>
                  </div>
                )}
                {agent.phone && (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{agent.phone}</span>
                  </div>
                )}
              </div>

              {agent.properties_count !== undefined && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-lg text-blue-600">{agent.properties_count}</span> Properties
                  </p>
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
