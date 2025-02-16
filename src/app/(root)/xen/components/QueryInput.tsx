import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import  Input  from '@/components/ui/input';
import  Button  from '@/components/ui/button';

interface QueryInputProps {
  onSubmitQuery: (query: string) => Promise<void>;
  isProcessing: boolean;
}

const QueryInput = ({ onSubmitQuery, isProcessing }: QueryInputProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = async () => {
    if (!query.trim() || isProcessing) return;
    await onSubmitQuery(query);
    setQuery('');
  };

  return (
    <div className="border-t border-gray-700 p-6">
      <div className="flex flex-col space-y-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me anything..."
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 text-lg p-6 rounded-xl"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={isProcessing}
        />
        <Button
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl p-6 h-auto text-lg font-semibold"
          onClick={handleSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Ask Xen</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QueryInput;