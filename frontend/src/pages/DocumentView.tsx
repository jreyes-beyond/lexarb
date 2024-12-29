import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DocumentViewer } from '@/components/documents/DocumentViewer';
import { AnalysisPanel } from '@/components/documents/AnalysisPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

interface DocumentViewProps {
  documentId: string;
}

export const DocumentView: React.FC<DocumentViewProps> = ({ documentId }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { data: document, isLoading: isLoadingDocument } = useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/documents/${documentId}`);
      if (!response.ok) throw new Error('Failed to fetch document');
      return response.json();
    },
  });
  
  const { data: analysis, isLoading: isLoadingAnalysis } = useQuery({
    queryKey: ['document-analysis', documentId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/documents/${documentId}/analysis`);
      if (!response.ok) throw new Error('Failed to fetch analysis');
      return response.json();
    },
  });
  
  if (isLoadingDocument || isLoadingAnalysis) {
    return (
      <div className="h-full w-full p-6">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }
  
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      <ResizablePanel defaultSize={65}>
        <DocumentViewer
          url={document.url}
          title={document.title}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        />
      </ResizablePanel>
      
      {!isFullscreen && (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={35}>
            <AnalysisPanel analysis={analysis} />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};