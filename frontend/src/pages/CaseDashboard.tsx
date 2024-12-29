import React from 'react';
import { CaseOverview } from '@/components/cases/CaseOverview';
import { CaseTimeline } from '@/components/cases/CaseTimeline';
import { CaseStatistics } from '@/components/cases/CaseStatistics';
import { RecentActivity } from '@/components/cases/RecentActivity';

interface CaseDashboardProps {
  caseId: string;
}

export const CaseDashboard: React.FC<CaseDashboardProps> = ({ caseId }) => {
  // Here we would typically fetch case data using React Query
  // For now, we'll use mock data
  const caseData = {
    id: caseId,
    title: 'Example Arbitration Case',
    status: 'active',
    createdAt: '2024-01-01',
    nextDeadline: '2024-02-15',
    description: 'International commercial arbitration case involving contract dispute.',
    participants: [
      { id: '1', name: 'John Doe', role: 'Arbitrator', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', role: 'Party A', email: 'jane@example.com' },
    ],
  };

  const timelineEvents = [
    {
      id: '1',
      type: 'document' as const,
      title: 'Contract Submitted',
      description: 'Initial contract documentation submitted by Party A',
      timestamp: '2024-01-01T10:00:00Z',
      metadata: {
        fileSize: '2.3 MB',
        pages: 45,
      },
    },
    // Add more events...
  ];

  const statistics = {
    documents: 12,
    timeToResolution: '45 days',
    activeParticipants: 4,
    communications: 28,
  };

  const activities = [
    {
      id: '1',
      user: {
        name: 'John Doe',
        avatar: '/avatars/john.jpg',
      },
      action: 'uploaded',
      target: 'Contract Document',
      timestamp: '2024-01-01T10:00:00Z',
    },
    // Add more activities...
  ];

  return (
    <div className="space-y-6 p-6">
      <CaseOverview caseData={caseData} />
      
      <CaseStatistics stats={statistics} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <CaseTimeline events={timelineEvents} />
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
};