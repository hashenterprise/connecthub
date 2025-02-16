'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { 
  Video, 
  MessageSquare, 
  Map, 
  User,
  ArrowRight,
  Bot,
  Sun,
  Moon,
  FilmIcon as Film
} from 'lucide-react';
import { useEffect, useState } from 'react';

const FeatureCard = ({ icon: Icon, title, description, href, index }) => {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, y: -5 }}
        className="relative overflow-hidden rounded-2xl bg-white/10 dark:bg-gray-800/10 
                   backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20 p-6
                   group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 
                        group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          <div className="mb-4 inline-block rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-3
                         group-hover:animate-pulse">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent 
                         bg-gradient-to-r from-blue-500 to-purple-500">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/0 to-purple-500/0 
                        opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      </motion.div>
    </Link>
  );
};

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-lg
                 border border-gray-200/20 dark:border-gray-700/20 hover:border-blue-500/50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
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
            <Sun className="w-6 h-6 text-yellow-500" /> : 
            <Moon className="w-6 h-6 text-blue-500" />
          }
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, #3b82f6 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, #8b5cf6 0%, transparent 50%)',
            'radial-gradient(circle at 0% 100%, #3b82f6 0%, transparent 50%)',
            'radial-gradient(circle at 100% 0%, #8b5cf6 0%, transparent 50%)',
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Mouse follower effect */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity"
        animate={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
        }}
      />

      <ThemeToggle />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-7xl font-bold mb-6 bg-clip-text text-transparent 
                       bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Welcome to Xen
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Experience the future of digital connection and collaboration
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: MessageSquare,
              href: '/chat',
              title: "Neural Chat",
              description: "AI-powered conversations with contextual understanding and real-time translation"
            },
            {
              icon: Video,
              href: '/meet',
              title: "Holographic Meetings",
              description: "Immersive video calls with 3D presence and spatial audio"
            },
            {
              icon: Map,
              href: '/location',
              title: "Quantum Location",
              description: "Precise real-time positioning with augmented reality overlays"
            },
            {
              icon: User,
              href: '/profile',
              title: "Teachmint Learning",
              description: "Secure blockchain-verified profiles with quantum encryption"
            },
            {
              icon: Film,
              href: '/shorts',
              title: "QuantumClips",
              description: "Short-form quantum-enhanced video experiences with AI-powered transitions"
            },
            {
              icon: Bot,
              href: '/xen',
              title: "Xen AI Assistant",
              description: "Your personal AI companion powered by advanced neural networks"
            }
          ].map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}