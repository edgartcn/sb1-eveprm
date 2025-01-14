import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function DashboardCard({ title, description, icon: Icon, onClick }: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <Icon className="w-8 h-8 text-blue-900" />
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}