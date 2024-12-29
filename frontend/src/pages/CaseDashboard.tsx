import React from 'react';
import { useParams } from '@tanstack/react-router';
import { CaseOverview } from '@/components/cases/CaseOverview';
import { CaseTimeline } from '@/components/cases/CaseTimeline';
import { CaseStatistics } from '@/components/cases/CaseStatistics';
import { RecentActivity } from '@/components/cases/RecentActivity';
import { useCase } from '@/hooks/useCase';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const CaseDashboard: React.FC = () => {
  const { caseId } = useParams();
  const {
    case: caseData,
    timeline,
    statistics,
    activities,
    isLoading,
    isError,
    updateCase,
  } = useCase(caseId);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[100px] rounded-lg" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] rounded-lg" />
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            There was an error loading the case data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!caseData || !timeline || !statistics || !activities) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <CaseOverview caseData={caseData} />
      
      <CaseStatistics stats={statistics} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <CaseTimeline events={timeline} />
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
};

export default CaseDashboard;