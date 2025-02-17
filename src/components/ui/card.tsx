import React from 'react';
import { useTheme } from 'next-themes';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  const { theme } = useTheme();
  const themeClasses = theme === 'light' ? 'bg-white text-black' : 'bg-indigo-950 text-white';

  return (
    <div className={`shadow-md rounded-lg p-4 ${themeClasses} ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
  return (
    <div className="border-b pb-2 mb-4">
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children }) => {
  return (
    <h2 className="text-xl font-semibold">
      {children}
    </h2>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
};