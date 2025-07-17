import React from 'react';
import { Card } from '../ui/Card';

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick 
}) => {
  const getIconColor = () => {
    switch (title) {
      case 'Password Generator':
        return 'text-purple-400 group-hover:text-purple-300';
      case 'Strength Check':
        return 'text-green-400 group-hover:text-green-300';
      case 'Breach Check':
        return 'text-red-400 group-hover:text-red-300';
      case 'Saved Passwords':
        return 'text-blue-400 group-hover:text-blue-300';
      default:
        return 'text-purple-400 group-hover:text-purple-300';
    }
  };

  return (
    <Card hoverable onClick={onClick} className="text-center p-8 rounded-2xl group">
      <Icon className={`h-16 w-16 ${getIconColor()} mx-auto mb-6 transition-colors`} />
      <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-purple-300 group-hover:text-purple-200 transition-colors">{description}</p>
    </Card>
  );
};