'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Video, 
  Map,
  User,
  Bot,
  Menu,
  X,
  Home,
  Film
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: MessageSquare, label: 'Neural Chat', href: '/chat' },
    { icon: Video, label: 'Holographic Meets', href: '/meet' },
    { icon: Map, label: 'Quantum Location', href: '/location' },
    { icon: User, label: 'Teachmint Learning', href: '/profile' },
    { icon: Film, label: 'QuantumClips', href: '/shorts' },
    { icon: Bot, label: 'Xen AI', href: '/xen' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-lg
                   border border-gray-200/20 dark:border-gray-700/20"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <motion.div
        initial={{ x: -300 }}
        animate={{ 
          x: isOpen ? 0 : -300,
          opacity: isOpen ? 1 : 0
        }}
        exit={{
          x: -300,
          opacity: 0
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          opacity: { duration: 0.2 }
        }}
        className={`fixed left-0 top-0 h-screen w-64 bg-white/10 dark:bg-gray-800/10 
                   backdrop-blur-xl border-r border-gray-200/20 dark:border-gray-700/20 
                   z-40 transition-all duration-300`}
      >
        {/* Add this glowing line effect when closing */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: isOpen ? 0 : 1,
            opacity: isOpen ? 0 : 1
          }}
          transition={{
            duration: 0.3,
            delay: isOpen ? 0 : 0.1
          }}
          className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 
                     origin-right blur-sm"
        />
        
        {/* Existing sidebar content */}
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold bg-clip-text text-transparent 
                     bg-gradient-to-r from-blue-500 to-purple-500 mb-8"
          >
            Xen
          </motion.div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                               ${isActive ? 
                                 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-500' : 
                                 'hover:bg-white/10 dark:hover:bg-gray-800/30'
                               }`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;