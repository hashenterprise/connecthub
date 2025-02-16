import React from 'react';
import { X } from 'lucide-react';

interface EndCallButtonProps {
  onClick: () => void;
}

const EndCallButton: React.FC<EndCallButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center"
    >
      <X className="h-5 w-5 mr-2" />
      End Call
    </button>
  );
};

export default EndCallButton;