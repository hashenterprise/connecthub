import React from 'react';
import { Card } from '@/components/ui/card';
import { Interaction } from '../types';
import { Loader2 } from 'lucide-react';

interface ResponseCardProps {
  interaction: Interaction;
}

const ResponseCard: React.FC<ResponseCardProps> = ({ interaction }) => (
  <Card className="bg-gray-800/50 border-gray-700 p-6 rounded-xl space-y-4">
    <div className="space-y-2">
      <div className="flex items-start space-x-2">
        <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
          Your Query
        </div>
        <p className="text-gray-300">{interaction.query}</p>
      </div>
    </div>
    
    <div className="space-y-2">
      <div className="flex items-start space-x-2">
        <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
          Xen's Response
        </div>
        <div className="text-white">
          {interaction.status === 'loading' ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          ) : interaction.status === 'error' ? (
            <div className="text-red-400">
              Sorry, I encountered an error. Please try again.
            </div>
          ) : (
            <div>
              {interaction.type === 'text' && interaction.response}
              {interaction.type === 'image' && (
                <img src={interaction.mediaUrl} alt="Generated" className="rounded-lg max-w-full" />
              )}
              {interaction.type === 'video' && (
                <video src={interaction.mediaUrl} controls className="rounded-lg max-w-full" />
              )}
              {interaction.type === 'file' && (
                <a href={interaction.mediaUrl} download className="text-blue-400 hover:text-blue-300">
                  Download Generated File
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </Card>
);

export default ResponseCard;