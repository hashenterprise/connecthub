import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown,
  Wand2,
  Beaker,
  Code,
  Calculator,
  Languages,
  Binary,
  GraduationCap,
  X
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'For You', icon: Wand2 },
  { id: 'science', label: 'Science', icon: Beaker },
  { id: 'coding', label: 'Coding', icon: Code },
  { id: 'math', label: 'Mathematics', icon: Calculator },
  { id: 'language', label: 'Languages', icon: Languages },
  { id: 'technology', label: 'Technology', icon: Binary },
  { id: 'academic', label: 'Academic', icon: GraduationCap },
];

const CategoryNav = ({ currentCategory, setCurrentCategory }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-20 right-0 left-0 z-20 px-4 lg:pl-72"
    >
      {/* Mobile Trigger */}
      <div className="lg:hidden mx-auto flex items-center justify-between bg-white/10 dark:bg-gray-800/10 
                      backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20 px-4 py-3 rounded-2xl">
        <div className="flex items-center gap-2">
          {categories.find(cat => cat.id === currentCategory)?.icon && 
            <categories.find(cat => cat.id === currentCategory).icon className="w-5 h-5" />}
          <span className="text-gray-700 dark:text-gray-200">{categories.find(cat => cat.id === currentCategory)?.label}</span>
        </div>
        <motion.button
          onClick={() => setIsNavOpen(!isNavOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isNavOpen ? 'rotate-180' : ''}`} />
        </motion.button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mx-auto mt-2 bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl 
                      border border-gray-200/20 dark:border-gray-700/20 rounded-2xl overflow-hidden"
          >
            <div className="p-2 space-y-1">
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  onClick={() => {
                    setCurrentCategory(category.id);
                    setIsNavOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all
                    ${currentCategory === category.id ? 
                      'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-500' : 
                      'hover:bg-white/10 dark:hover:bg-gray-800/30'}`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <category.icon className={`w-5 h-5 ${currentCategory === category.id ? 'text-blue-500' : ''}`} />
                  <span className="font-medium">{category.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Categories */}
      <div className="hidden lg:block mx-auto bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl 
                      border border-gray-200/20 dark:border-gray-700/20 rounded-2xl">
        <div className="flex items-center gap-2 p-2 overflow-x-auto no-scrollbar">
          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => setCurrentCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap
                ${currentCategory === category.id ? 
                  'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-500' : 
                  'hover:bg-white/10 dark:hover:bg-gray-800/30'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon className={`w-5 h-5 ${currentCategory === category.id ? 'text-blue-500' : ''}`} />
              <span className="font-medium">{category.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryNav;