'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);

  // Hide loading state after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-[calc(100vh-6rem)] w-full relative px-4">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading Teachmint...</p>
          </div>
        </div>
      )}

      {/* Teachmint iframe */}
      <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <iframe
          src="https://www.teachmint.com"
          className="w-full h-full"
          style={{ border: 'none', padding: '1rem' }}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}