'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { UserButton } from '@clerk/nextjs';
import { 
  Bell, 
  Search,
  Sun,
  Moon,
  Command
} from 'lucide-react';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 right-0 left-0 z-30 px-4 lg:pl-72"
    >
      <div className="mx-auto h-16 flex items-center justify-between bg-white/10 dark:bg-gray-800/10 
                      backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20 px-4 rounded-2xl 
                      my-4 gap-4">
        {/* Command Menu */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400
                     bg-gray-100/50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-200/50 
                     dark:hover:bg-gray-700/50 transition-colors w-72"
        >
          <Command className="w-4 h-4" />
          <span>Quick search...</span>
          <kbd className="ml-auto bg-gray-200/50 dark:bg-gray-700/50 px-2 py-0.5 rounded text-xs">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 
                       transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 
                       transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? 
                  <Sun className="w-5 h-5 text-yellow-500" /> : 
                  <Moon className="w-5 h-5 text-blue-500" />
                }
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Clerk User Button */}
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-lg overflow-hidden",
              }
            }}
          />
        </div>
      </div>

      {/* Command Menu Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  autoFocus
                  placeholder="Search anything..."
                  className="flex-1 bg-transparent border-none outline-none"
                />
                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                  ESC
                </kbd>
              </div>
              {/* Command Menu Results would go here */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;