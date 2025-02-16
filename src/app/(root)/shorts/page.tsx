'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Bookmark,
  Wand2,
  Beaker,
  Code,
  Calculator,
  Languages,
  Binary,
  GraduationCap,
  Upload
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useToast } from '@/components/ui/use-toast';
import ScrollArea from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/ui/button';

interface Clip {
  id: string;
  creator: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  thumbnailUrl: string;
  isLiked: boolean;
  isSaved: boolean;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  viewCount: number;
  videoUrl?: string;
}

// Educational content categories
const categories = [
  { id: 'all', label: 'For You', icon: Wand2 },
  { id: 'science', label: 'Science', icon: Beaker },
  { id: 'coding', label: 'Coding', icon: Code },
  { id: 'math', label: 'Mathematics', icon: Calculator },
  { id: 'language', label: 'Languages', icon: Languages },
  { id: 'technology', label: 'Technology', icon: Binary },
  { id: 'academic', label: 'Academic', icon: GraduationCap },
];

const QuantumClipsPage = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [currentCategory, setCurrentCategory] = useState('all');
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const [clips, setClips] = useState<Clip[]>([
    {
      id: '1',
      creator: 'CodeQuantum',
      title: 'Understanding React Hooks',
      description: 'Quick guide to useState and useEffect with practical examples',
      likes: 15423,
      comments: 892,
      shares: 2341,
      thumbnailUrl: '/api/placeholder/400/600',
      isLiked: false,
      isSaved: false,
      category: 'coding',
      tags: ['react', 'javascript', 'webdev'],
      difficulty: 'intermediate',
      duration: 60,
      viewCount: 45678,
      videoUrl: '/videos/coding/react-hooks.mp4',
    },
    {
      id: '2',
      creator: 'MathMaster',
      title: 'Calculus in 60 Seconds',
      description: 'Quick explanation of derivatives and their real-world applications',
      likes: 12567,
      comments: 743,
      shares: 1892,
      thumbnailUrl: '/api/placeholder/400/600',
      isLiked: false,
      isSaved: false,
      category: 'math',
      tags: ['calculus', 'derivatives', 'mathematics'],
      difficulty: 'advanced',
      duration: 60,
      viewCount: 34567,
      videoUrl: '/videos/math/calculus.mp4',
    },
    {
      id: '3',
      creator: 'ScienceExplorer',
      title: 'Quantum Mechanics Basics',
      description: 'Understanding superposition and entanglement simply',
      likes: 18934,
      comments: 1023,
      shares: 2789,
      thumbnailUrl: '/api/placeholder/400/600',
      isLiked: false,
      isSaved: false,
      category: 'science',
      tags: ['quantum', 'physics', 'science'],
      difficulty: 'intermediate',
      duration: 60,
      viewCount: 56789,
      videoUrl: '/videos/science/quantum-mechanics.mp4',
    },
    {
      id: '4',
      creator: 'LanguageLearner',
      title: 'English Idioms Explained',
      description: 'Common English idioms and their origins',
      likes: 13456,
      comments: 867,
      shares: 1945,
      thumbnailUrl: '/api/placeholder/400/600',
      isLiked: false,
      isSaved: false,
      category: 'language',
      tags: ['english', 'idioms', 'language'],
      difficulty: 'beginner',
      duration: 60,
      viewCount: 43210,
      videoUrl: '/videos/language/english-idioms.mp4',
    },
    // Add more educational clips here
  ]);

  // Filter clips based on category and user preferences
  const filteredClips = clips.filter(clip => 
    currentCategory === 'all' || clip.category === currentCategory
  ).sort((a, b) => {
    // Prioritize clips with tags matching user preferences
    const aPreferenceMatch = a.tags.filter(tag => userPreferences.includes(tag)).length;
    const bPreferenceMatch = b.tags.filter(tag => userPreferences.includes(tag)).length;
    return bPreferenceMatch - aPreferenceMatch;
  });

  const handleLike = (clipId: string) => {
    setClips(prevClips => 
      prevClips.map(clip => {
        if (clip.id === clipId) {
          // Update user preferences based on liked content
          if (!clip.isLiked) {
            setUserPreferences(prev => [...new Set([...prev, ...clip.tags])]);
          }
          return { 
            ...clip, 
            isLiked: !clip.isLiked, 
            likes: clip.isLiked ? clip.likes - 1 : clip.likes + 1 
          };
        }
        return clip;
      })
    );
  };

  const handleSave = (clipId: string) => {
    setClips(prevClips =>
      prevClips.map(clip =>
        clip.id === clipId
          ? { ...clip, isSaved: !clip.isSaved }
          : clip
      )
    );
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        // Add the new clip to the state
        const newClip = {
          id: String(Date.now()),
          creator: 'Current User', // Replace with actual user info
          title: file.name,
          description: '',
          likes: 0,
          comments: 0,
          shares: 0,
          thumbnailUrl: URL.createObjectURL(file),
          videoUrl: URL.createObjectURL(file),
          isLiked: false,
          isSaved: false,
          category: currentCategory,
          tags: [],
          difficulty: 'beginner' as const,
          duration: 60,
          viewCount: 0
        };
        setClips(prev => [newClip, ...prev]);
        setIsUploadOpen(false);
        setUploadProgress(0);
        toast({
          title: "Upload Complete",
          description: "Your video has been uploaded successfully!"
        });
      }
    }, 500);
  };

  const handleVideoPlay = (clipId: string) => {
    setCurrentVideoId(clipId);
  };

  useEffect(() => {
    Object.keys(videoRefs.current).forEach((id) => {
      const videoElement = videoRefs.current[id];
      if (videoElement) {
        if (id === currentVideoId) {
          videoElement.play();
          videoElement.muted = false;
        } else {
          videoElement.pause();
          videoElement.muted = true;
        }
      }
    });
  }, [currentVideoId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Quantum particle effect background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
              'radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
              'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      {/* Category tabs */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <ScrollArea className="py-4" orientation="horizontal">
          <TabsList>
            {categories.map(category => (
              <TabsTrigger
                key={category.id}
                onClick={() => setCurrentCategory(category.id)}
                isActive={currentCategory === category.id}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex h-screen pt-16">
        {/* Main video feed */}
        <ScrollArea className="h-screen w-full">
          {filteredClips.map((clip, index) => (
            <motion.div
              key={clip.id}
              className="h-screen relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleVideoPlay(clip.id)}
            >
              {clip.videoUrl ? (
                <video
                  ref={(el) => (videoRefs.current[clip.id] = el)}
                  className="absolute inset-0 w-full h-full object-cover"
                  src={clip.videoUrl}
                  loop
                  playsInline
                  muted={clip.id !== currentVideoId} // Mute all videos except the current one
                />
              ) : (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm">
                  <img
                    src={clip.thumbnailUrl}
                    alt={clip.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Clip information overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`px-2 py-1 rounded-full text-xs 
                                 ${clip.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                                   clip.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                                   'bg-red-500/20 text-red-300'}`}>
                    {clip.difficulty}
                  </div>
                  <div className="px-2 py-1 rounded-full bg-white/10 text-xs text-white">
                    {clip.duration}s
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">{clip.title}</h2>
                <p className="text-gray-200 mb-4">{clip.description}</p>
                
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  <div className="flex-1">
                    <span className="text-white font-medium block">{clip.creator}</span>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{clip.viewCount.toLocaleString()} views</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        {clip.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 rounded-full bg-white/10">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interaction buttons */}
              <div className="absolute right-6 bottom-32 space-y-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center"
                  onClick={() => handleLike(clip.id)}
                >
                  <div className="p-3 rounded-full bg-white/10 backdrop-blur-xl">
                    <Heart 
                      className={`w-6 h-6 ${clip.isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`}
                    />
                  </div>
                  <span className="text-white text-sm mt-1">{clip.likes}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center"
                >
                  <div className="p-3 rounded-full bg-white/10 backdrop-blur-xl">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-sm mt-1">{clip.comments}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center"
                  onClick={() => handleSave(clip.id)}
                >
                  <div className="p-3 rounded-full bg-white/10 backdrop-blur-xl">
                    <Bookmark 
                      className={`w-6 h-6 ${clip.isSaved ? 'text-blue-500 fill-blue-500' : 'text-white'}`}
                    />
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </ScrollArea>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Video</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => videoInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center"
            >
              <Upload className="w-8 h-8 mb-2" />
              <span>Click to upload video</span>
              <span className="text-sm text-gray-500">MP4, WebM, or OGG</span>
            </Button>
            {uploadProgress > 0 && (
              <div className="w-full mt-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 mt-1">{uploadProgress}% uploaded</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuantumClipsPage;