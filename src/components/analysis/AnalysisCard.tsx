import React from 'react';
import { LucideIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface AnalysisCardProps {
  id: string;
  title: string;
  icon: LucideIcon;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function AnalysisCard({
  id,
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  children,
}: AnalysisCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-6 h-6 text-blue-900" />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isExpanded && <div className="p-6 border-t border-gray-200">{children}</div>}
    </div>
  );
}