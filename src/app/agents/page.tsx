import { Metadata } from 'next';
import { agentService } from '@/lib/api';
import AgentList from '@/components/AgentList';

export const metadata: Metadata = {
  title: 'Our Agents - Real Estate',
  description: 'Meet our professional real estate agents',
};

interface AgentsPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const response = await agentService.getAgents(page, 12);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Agents</h1>
        <p className="text-gray-600">Meet our team of professional real estate experts</p>
      </div>
      <AgentList agents={response.data} pagination={response} />
    </div>
  );
}
