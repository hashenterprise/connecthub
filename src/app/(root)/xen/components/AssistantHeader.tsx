import React from 'react';
import { Sparkles } from 'lucide-react';

const AssistantHeader: React.FC = () => (
  <div className="border-b border-gray-700 p-6">
    <div className="flex items-center space-x-4">
      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">Xen AI Assistant</h1>
        <p className="text-gray-400">Your intelligent digital companion</p>
      </div>
    </div>
  </div>
);

export default AssistantHeader;