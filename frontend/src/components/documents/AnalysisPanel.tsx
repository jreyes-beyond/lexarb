import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalysisPanelProps {
  analysis: {
    classification: string;
    summary: string;
    key_information: Record<string, any>;
    citations: Array<string>;
    metadata: Record<string, any>;
  };
  className?: string;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  analysis,
  className,
}) => {
  return (
    <div className={className}>
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="font-medium">Document Analysis</h3>
        <Badge variant="secondary">{analysis.classification}</Badge>
      </div>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="w-full justify-start px-4 py-2 border-b">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="key-info">Key Information</TabsTrigger>
          <TabsTrigger value="citations">Citations</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="p-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600">{analysis.summary}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="key-info" className="p-4">
          <Card>
            <CardContent className="pt-4 space-y-4">
              {Object.entries(analysis.key_information).map(([key, value]) => (
                <div key={key}>
                  <h4 className="text-sm font-medium text-gray-500">{key}</h4>
                  <p className="text-sm mt-1">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="citations" className="p-4">
          <Card>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {analysis.citations.map((citation, index) => (
                  <li key={index} className="text-sm">{citation}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metadata" className="p-4">
          <Card>
            <CardContent className="pt-4 space-y-4">
              {Object.entries(analysis.metadata).map(([key, value]) => (
                <div key={key}>
                  <h4 className="text-sm font-medium text-gray-500">{key}</h4>
                  <p className="text-sm mt-1">{String(value)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};