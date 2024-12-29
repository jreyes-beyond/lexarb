import React from 'react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Mail, Calendar, MessageSquare } from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'document' | 'email' | 'deadline' | 'comment';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface CaseTimelineProps {
  events: TimelineEvent[];
}

export const CaseTimeline: React.FC<CaseTimelineProps> = ({ events }) => {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'deadline':
        return <Calendar className="h-5 w-5" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'document':
        return 'bg-blue-100 text-blue-800';
      case 'email':
        return 'bg-purple-100 text-purple-800';
      case 'deadline':
        return 'bg-red-100 text-red-800';
      case 'comment':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

          {/* Timeline events */}
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="relative pl-10">
                {/* Event dot */}
                <div
                  className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${getEventColor(
                    event.type
                  )}`}
                >
                  {getEventIcon(event.type)}
                </div>

                {/* Event content */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge variant="secondary">
                      {formatDate(event.timestamp)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  
                  {/* Metadata display */}
                  {event.metadata && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div
                          key={key}
                          className="text-xs text-gray-500 flex items-center justify-between"
                        >
                          <span className="font-medium">{key}:</span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};