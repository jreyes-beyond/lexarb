export interface Participant {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface CaseData {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  nextDeadline?: string;
  description: string;
  participants: Participant[];
}

export interface TimelineEvent {
  id: string;
  type: 'document' | 'email' | 'deadline' | 'comment';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
}

export interface CaseStatistics {
  documents: number;
  timeToResolution: string;
  activeParticipants: number;
  communications: number;
}