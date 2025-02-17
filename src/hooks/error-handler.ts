import { useToast } from '@/components/ui/use-toast';
import React, { useEffect } from 'react';
export class MeetingError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message);
    this.name = 'MeetingError';
  }
}

interface ErrorHandlerProps {
  error: MeetingError;
}

// New component to handle toast display
export const ErrorDisplay: React.FC<ErrorHandlerProps> = ({ error }) => {
  const { addToast } = useToast();
  
  useEffect(() => {
    addToast({
      title: 'Error',
      description: error.userMessage,
      variant: 'destructive',
      duration: 5000,
    });
  }, [error, addToast]);
  
  return null;
};

export const meetingErrorHandler = {
  handleMediaError: (error: Error) => {
    console.error('Media Error:', error);
    
    if (error.name === 'NotAllowedError') {
      return new MeetingError(
        'Camera/Microphone permission denied',
        'MEDIA_PERMISSION_DENIED',
        'Please allow access to your camera and microphone'
      );
    }
    
    if (error.name === 'NotFoundError') {
      return new MeetingError(
        'Camera/Microphone not found',
        'MEDIA_NOT_FOUND',
        'No camera or microphone detected'
      );
    }
    
    return new MeetingError(
      'Unknown media error',
      'MEDIA_UNKNOWN',
      'Unable to access media devices'
    );
  },

  handleConnectionError: (error: Error) => {
    console.error('Connection Error:', error);
    
    if (error.message.includes('network')) {
      return new MeetingError(
        'Network connection failed',
        'NETWORK_ERROR',
        'Please check your internet connection'
      );
    }
    
    return new MeetingError(
      'Connection failed',
      'CONNECTION_ERROR',
      'Unable to connect to the meeting'
    );
  },

  handleStreamError: (error: Error) => {
    console.error('Stream Error:', error);
    return new MeetingError(
      'Stream connection failed',
      'STREAM_ERROR',
      'Unable to connect to the video stream'
    );
  }
};

export const withErrorHandler = 
  <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    errorHandler: (error: Error) => MeetingError
  ) => {
    return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      try {
        return await fn(...args);
      } catch (error) {
        const handledError = errorHandler(error as Error);
        // Instead of directly showing toast, return the error to be handled by component
        throw handledError;
      }
    };
  };