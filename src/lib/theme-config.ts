// src/lib/theme-config.ts
export const themeConfig = {
    light: {
      primary: '#2563eb',
      secondary: '#4f46e5',
      background: '#ffffff',
      foreground: '#171717',
      card: '#ffffff',
      accent: '#f3f4f6',
      border: '#e5e7eb',
      muted: '#9ca3af',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    dark: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      background: '#0a0a0a',
      foreground: '#ededed',
      card: '#1a1a1a',
      accent: '#262626',
      border: '#404040',
      muted: '#737373',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  }
  
  export const animations = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.98,
    },
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
    },
  }