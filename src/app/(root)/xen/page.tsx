'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import AssistantHeader from './components/AssistantHeader';
import QueryInput from './components/QueryInput';
import ResponseCard from './components/ResponseCard';

const XenAI = () => {
  const [interactions, setInteractions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addToast } = useToast();

  const handleQuery = async (query) => {
    const newInteraction = {
      id: Date.now(),
      query,
      response: '',
      type: 'text',
      status: 'loading',
      timestamp: new Date(),
    };
    setInteractions((prev) => [newInteraction, ...prev]);
    setIsProcessing(true);
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();
      setInteractions((prev) =>
        prev.map((interaction) =>
          interaction.id === newInteraction.id
            ? { ...interaction, response: data.response, status: 'complete' }
            : interaction
        )
      );
    } catch (error) {
      setInteractions((prev) =>
        prev.map((interaction) =>
          interaction.id === newInteraction.id
            ? { ...interaction, status: 'error' }
            : interaction
        )
      );
      addToast({
        title: 'Error',
        description: "I couldn't process your request. Please try again.",
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-md overflow-hidden">
          <AssistantHeader />
          <div className="p-6">
            <QueryInput onSubmitQuery={handleQuery} isProcessing={isProcessing} />
            <div className="mt-8 space-y-6">
              {interactions.map((interaction) => (
                <ResponseCard key={interaction.id} interaction={interaction} />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default XenAI;