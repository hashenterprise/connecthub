import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TabsProps {
  tabs: Tab[];
  currentTab: string;
  onTabClick: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, currentTab, onTabClick }) => {
  return (
    <div className="flex space-x-2 px-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={`flex items-center space-x-2 rounded-full px-4 py-2 
                     ${currentTab === tab.id ? 
                       'bg-gradient-to-r from-blue-500 to-purple-500' : 
                       'bg-white/10 hover:bg-white/20'}`}
        >
          <tab.icon className="w-4 h-4" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

interface TabsListProps {
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ children }) => {
  return <div className="flex space-x-2">{children}</div>;
};

interface TabsTriggerProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 rounded-full px-4 py-2 
                 ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-white/10 hover:bg-white/20'}`}
    >
      {children}
    </button>
  );
};