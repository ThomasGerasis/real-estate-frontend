import { apiClient } from '../client';
import { ApiResponse, Agent, PaginatedResponse } from '../types';

export const agentService = {
  async getAgents(page?: number, per_page?: number): Promise<PaginatedResponse<Agent>> {
    return apiClient.get<PaginatedResponse<Agent>>('/agents', {
      params: { page, per_page } as Record<string, string | number | boolean>,
    });
  },

  async getAgentById(id: number): Promise<Agent> {
    const response = await apiClient.get<ApiResponse<Agent>>(`/agents/${id}`);
    return response.data;
  },
};
