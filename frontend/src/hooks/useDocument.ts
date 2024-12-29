import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Document {
  id: string;
  title: string;
  url: string;
  contentType: string;
  status: string;
  createdAt: string;
}

interface DocumentAnalysis {
  classification: string;
  summary: string;
  key_information: Record<string, any>;
  citations: string[];
  metadata: Record<string, any>;
}

export function useDocument(documentId: string) {
  const queryClient = useQueryClient();

  const documentQuery = useQuery({
    queryKey: ['document', documentId],
    queryFn: async (): Promise<Document> => {
      const response = await fetch(`/api/v1/documents/${documentId}`);
      if (!response.ok) throw new Error('Failed to fetch document');
      return response.json();
    },
  });

  const analysisQuery = useQuery({
    queryKey: ['document-analysis', documentId],
    queryFn: async (): Promise<DocumentAnalysis> => {
      const response = await fetch(`/api/v1/documents/${documentId}/analysis`);
      if (!response.ok) throw new Error('Failed to fetch analysis');
      return response.json();
    },
  });

  const requestAnalysis = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/v1/documents/${documentId}/analyze`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to request analysis');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate analysis query to trigger refetch
      queryClient.invalidateQueries(['document-analysis', documentId]);
    },
  });

  return {
    document: documentQuery.data,
    analysis: analysisQuery.data,
    isLoading: documentQuery.isLoading || analysisQuery.isLoading,
    isError: documentQuery.isError || analysisQuery.isError,
    requestAnalysis,
  };
}