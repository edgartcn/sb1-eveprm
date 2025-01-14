import React from 'react';

interface DocumentPreviewProps {
  content: string;
}

export function DocumentPreview({ content }: DocumentPreviewProps) {
  return (
    <div className="h-full p-8 bg-white shadow-inner">
      <div className="max-w-[21cm] mx-auto bg-white p-8 min-h-[29.7cm] shadow-lg">
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content || '<p>Prévia do documento...</p>' }}
        />
      </div>
    </div>
  );
}