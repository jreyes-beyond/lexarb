import React, { useState } from 'react';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DocumentViewerProps {
  url: string;
  title: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  url,
  title,
  isFullscreen = false,
  onToggleFullscreen,
  className,
}) => {
  const [scale, setScale] = useState(1);
  
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };
  
  const handleDownload = () => {
    window.open(url, '_blank');
  };
  
  return (
    <div className={cn('flex flex-col h-full bg-white rounded-lg shadow-sm', className)}>
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium text-lg">{title}</h3>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          {onToggleFullscreen && (
            <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <iframe
          src={url}
          className="w-full h-full border-0"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
        />
      </div>
    </div>
  );
};