import React from 'react';
import { CalendarDays, Users, FileClock, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Participant {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface CaseOverviewProps {
  caseData: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    nextDeadline?: string;
    description: string;
    participants: Participant[];
  };
}

export const CaseOverview: React.FC<CaseOverviewProps> = ({ caseData }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{caseData.title}</CardTitle>
            <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
              <CalendarDays className="h-4 w-4" />
              <span>Created {formatDate(caseData.createdAt)}</span>
            </div>
          </div>
          <Badge className={getStatusColor(caseData.status)}>
            {caseData.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-sm text-gray-600">{caseData.description}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants
            </h3>
            <div className="space-y-2">
              {caseData.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium">{participant.name}</span>
                  <Badge variant="secondary">{participant.role}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <FileClock className="h-4 w-4" />
              Next Deadline
            </h3>
            {caseData.nextDeadline ? (
              <div className="text-sm">
                <p className="text-gray-600">
                  {formatDate(caseData.nextDeadline)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No upcoming deadlines</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-4">
          <Button variant="outline" size="sm">
            Export Details
          </Button>
          <Button size="sm">
            Add Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};