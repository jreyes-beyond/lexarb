import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CaseData, TimelineEvent, Activity } from '@/types/case';

export function useCase(caseId: string) {
  const queryClient = useQueryClient();

  const caseQuery = useQuery({
    queryKey: ['case', caseId],
    queryFn: async (): Promise<CaseData> => {
      const response = await fetch(`/api/v1/cases/${caseId}`);
      if (!response.ok) throw new Error('Failed to fetch case');
      return response.json();
    },
  });

  const timelineQuery = useQuery({
    queryKey: ['case-timeline', caseId],
    queryFn: async (): Promise<TimelineEvent[]> => {
      const response = await fetch(`/api/v1/cases/${caseId}/timeline`);
      if (!response.ok) throw new Error('Failed to fetch timeline');
      return response.json();
    },
  });

  const statisticsQuery = useQuery({
    queryKey: ['case-statistics', caseId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/cases/${caseId}/statistics`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      return response.json();
    },
  });

  const activitiesQuery = useQuery({
    queryKey: ['case-activities', caseId],
    queryFn: async (): Promise<Activity[]> => {
      const response = await fetch(`/api/v1/cases/${caseId}/activities`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
    },
  });

  const updateCase = useMutation({
    mutationFn: async (updates: Partial<CaseData>) => {
      const response = await fetch(`/api/v1/cases/${caseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update case');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['case', caseId]);
    },
  });

  return {
    case: caseQuery.data,
    timeline: timelineQuery.data,
    statistics: statisticsQuery.data,
    activities: activitiesQuery.data,
    isLoading:
      caseQuery.isLoading ||
      timelineQuery.isLoading ||
      statisticsQuery.isLoading ||
      activitiesQuery.isLoading,
    isError:
      caseQuery.isError ||
      timelineQuery.isError ||
      statisticsQuery.isError ||
      activitiesQuery.isError,
    updateCase,
  };
}