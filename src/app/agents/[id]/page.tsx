import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { agentService } from '@/lib/api';
import AgentProfile from '@/components/AgentProfile';

interface AgentPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  try {
    const agent = await agentService.getAgentById(parseInt(params.id));
    
    return {
      title: `${agent.name} - Real Estate Agent`,
      description: agent.bio || `Contact ${agent.name} for your real estate needs`,
    };
  } catch (error) {
    return {
      title: 'Agent Not Found',
    };
  }
}

export default async function AgentPage({ params }: AgentPageProps) {
  try {
    const agent = await agentService.getAgentById(parseInt(params.id));
    
    return <AgentProfile agent={agent} />;
  } catch (error) {
    notFound();
  }
}
