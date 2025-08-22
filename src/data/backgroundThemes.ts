import { BackgroundTheme } from '@/types/themes';

export const backgroundThemes: BackgroundTheme[] = [
  // Time of Day Themes
  {
    id: 'morning',
    name: 'Morning',
    description: 'Fresh morning with gentle sunrise',
    category: 'time',
    sky: {
      gradient: 'bg-gradient-to-b from-orange-200 via-yellow-100 to-blue-100',
      elements: [
        { id: 'sun', emoji: '🌅', position: { x: 'right-8', y: 'top-4' }, size: 'text-4xl', animation: 'animate-pulse' },
        { id: 'cloud1', emoji: '☁️', position: { x: 'left-12', y: 'top-8' }, size: 'text-2xl', opacity: 0.7 },
      ]
    },
    ground: {
      color: 'from-green-400',
      gradient: 'bg-gradient-to-t from-green-400 to-green-300'
    },
    cost: 0,
    owned: true
  },
  
  {
    id: 'noon',
    name: 'Bright Day',
    description: 'Sunny clear day with blue skies',
    category: 'time',
    sky: {
      gradient: 'bg-gradient-to-b from-blue-400 via-blue-200 to-green-100',
      elements: [
        { id: 'sun', emoji: '☀️', position: { x: 'right-6', y: 'top-4' }, size: 'text-4xl', animation: 'animate-pulse' },
        { id: 'cloud1', emoji: '☁️', position: { x: 'left-8', y: 'top-6' }, size: 'text-xl', opacity: 0.6 },
        { id: 'cloud2', emoji: '🌤️', position: { x: 'right-20', y: 'top-8' }, size: 'text-lg', opacity: 0.4 },
      ]
    },
    ground: {
      color: 'from-amber-600',
      gradient: 'bg-gradient-to-t from-amber-700 to-amber-500'
    },
    cost: 0,
    owned: true
  },

  {
    id: 'sunset',
    name: 'Golden Sunset',
    description: 'Beautiful golden hour with warm colors',
    category: 'time',
    sky: {
      gradient: 'bg-gradient-to-b from-purple-400 via-pink-300 to-orange-200',
      elements: [
        { id: 'sun', emoji: '🌇', position: { x: 'left-8', y: 'top-12' }, size: 'text-4xl', animation: 'animate-pulse' },
        { id: 'cloud1', emoji: '☁️', position: { x: 'right-12', y: 'top-8' }, size: 'text-2xl', opacity: 0.8 },
      ]
    },
    ground: {
      color: 'from-orange-600',
      gradient: 'bg-gradient-to-t from-orange-700 to-orange-500'
    },
    cost: 40,
    owned: false
  },

  {
    id: 'night',
    name: 'Starry Night',
    description: 'Peaceful night under the stars',
    category: 'time',
    sky: {
      gradient: 'bg-gradient-to-b from-indigo-900 via-purple-800 to-blue-600',
      elements: [
        { id: 'moon', emoji: '🌙', position: { x: 'right-8', y: 'top-6' }, size: 'text-3xl', animation: 'animate-pulse' },
        { id: 'star1', emoji: '⭐', position: { x: 'left-12', y: 'top-4' }, size: 'text-lg', animation: 'animate-pulse' },
        { id: 'star2', emoji: '✨', position: { x: 'right-16', y: 'top-12' }, size: 'text-sm', animation: 'animate-pulse' },
        { id: 'star3', emoji: '⭐', position: { x: 'left-20', y: 'top-10' }, size: 'text-lg', animation: 'animate-pulse' },
      ]
    },
    ground: {
      color: 'from-gray-700',
      gradient: 'bg-gradient-to-t from-gray-800 to-gray-600'
    },
    cost: 50,
    owned: false
  },

  // Weather Themes
  {
    id: 'rainy',
    name: 'Gentle Rain',
    description: 'Refreshing rain shower',
    category: 'weather',
    sky: {
      gradient: 'bg-gradient-to-b from-gray-500 via-gray-300 to-blue-200',
      elements: [
        { id: 'cloud1', emoji: '🌧️', position: { x: 'left-8', y: 'top-6' }, size: 'text-3xl', opacity: 0.8 },
        { id: 'cloud2', emoji: '☁️', position: { x: 'right-12', y: 'top-4' }, size: 'text-2xl', opacity: 0.7 },
      ]
    },
    ground: {
      color: 'from-emerald-600',
      gradient: 'bg-gradient-to-t from-emerald-700 to-emerald-500'
    },
    weather: { type: 'rain', intensity: 'light' },
    cost: 60,
    owned: false
  },

  {
    id: 'snowy',
    name: 'Winter Wonderland',
    description: 'Magical snowy landscape',
    category: 'weather',
    sky: {
      gradient: 'bg-gradient-to-b from-gray-200 via-white to-blue-100',
      elements: [
        { id: 'cloud1', emoji: '🌨️', position: { x: 'left-12', y: 'top-6' }, size: 'text-3xl', opacity: 0.9 },
        { id: 'cloud2', emoji: '❄️', position: { x: 'right-8', y: 'top-8' }, size: 'text-2xl', animation: 'animate-spin-slow' },
      ]
    },
    ground: {
      color: 'from-blue-200',
      gradient: 'bg-gradient-to-t from-blue-300 to-blue-100'
    },
    weather: { type: 'snow', intensity: 'medium' },
    cost: 80,
    owned: false
  },

  // Seasonal Themes
  {
    id: 'spring',
    name: 'Spring Meadow',
    description: 'Fresh spring with blooming flowers',
    category: 'season',
    sky: {
      gradient: 'bg-gradient-to-b from-pink-200 via-green-100 to-yellow-100',
      elements: [
        { id: 'sun', emoji: '🌞', position: { x: 'right-8', y: 'top-6' }, size: 'text-3xl', animation: 'animate-bounce' },
        { id: 'butterfly', emoji: '🦋', position: { x: 'left-16', y: 'top-12' }, size: 'text-xl', animation: 'animate-pulse' },
        { id: 'flower', emoji: '🌸', position: { x: 'right-20', y: 'top-16' }, size: 'text-lg' },
      ]
    },
    ground: {
      color: 'from-pink-400',
      gradient: 'bg-gradient-to-t from-pink-500 to-pink-300'
    },
    weather: { type: 'butterflies', intensity: 'light' },
    cost: 90,
    owned: false
  },

  {
    id: 'autumn',
    name: 'Autumn Forest',
    description: 'Beautiful fall colors with falling leaves',
    category: 'season',
    sky: {
      gradient: 'bg-gradient-to-b from-orange-300 via-yellow-200 to-red-100',
      elements: [
        { id: 'sun', emoji: '🍂', position: { x: 'left-12', y: 'top-8' }, size: 'text-2xl', animation: 'animate-bounce' },
        { id: 'leaf1', emoji: '🍁', position: { x: 'right-16', y: 'top-6' }, size: 'text-xl', animation: 'animate-pulse' },
        { id: 'leaf2', emoji: '🍃', position: { x: 'left-20', y: 'top-12' }, size: 'text-lg' },
      ]
    },
    ground: {
      color: 'from-red-600',
      gradient: 'bg-gradient-to-t from-red-700 to-red-500'
    },
    weather: { type: 'leaves', intensity: 'medium' },
    cost: 90,
    owned: false
  },

  // Environment Themes
  {
    id: 'desert',
    name: 'Desert Oasis',
    description: 'Warm desert with golden sands',
    category: 'environment',
    sky: {
      gradient: 'bg-gradient-to-b from-yellow-400 via-orange-200 to-amber-100',
      elements: [
        { id: 'sun', emoji: '🌵', position: { x: 'left-8', y: 'top-16' }, size: 'text-2xl' },
        { id: 'sun2', emoji: '☀️', position: { x: 'right-6', y: 'top-4' }, size: 'text-4xl', animation: 'animate-pulse' },
      ]
    },
    ground: {
      color: 'from-yellow-600',
      gradient: 'bg-gradient-to-t from-yellow-700 to-yellow-500'
    },
    cost: 130,
    owned: false
  },

  {
    id: 'ocean',
    name: 'Ocean Breeze',
    description: 'Peaceful ocean view with seagulls',
    category: 'environment',
    sky: {
      gradient: 'bg-gradient-to-b from-blue-400 via-cyan-200 to-blue-100',
      elements: [
        { id: 'seagull', emoji: '🕊️', position: { x: 'left-16', y: 'top-8' }, size: 'text-xl', animation: 'animate-bounce' },
        { id: 'cloud', emoji: '☁️', position: { x: 'right-12', y: 'top-6' }, size: 'text-2xl', opacity: 0.7 },
      ]
    },
    ground: {
      color: 'from-cyan-600',
      gradient: 'bg-gradient-to-t from-cyan-700 to-cyan-500'
    },
    cost: 150,
    owned: false
  },

  // Special Themes
  {
    id: 'rainbow',
    name: 'Rainbow Magic',
    description: 'Magical rainbow after the storm',
    category: 'special',
    sky: {
      gradient: 'bg-gradient-to-b from-purple-400 via-pink-300 via-yellow-200 via-green-200 to-blue-200',
      elements: [
        { id: 'rainbow', emoji: '🌈', position: { x: 'left-12', y: 'top-8' }, size: 'text-4xl', animation: 'animate-pulse' },
        { id: 'sparkle1', emoji: '✨', position: { x: 'right-8', y: 'top-6' }, size: 'text-xl', animation: 'animate-spin' },
        { id: 'sparkle2', emoji: '🌟', position: { x: 'left-20', y: 'top-12' }, size: 'text-lg', animation: 'animate-pulse' },
      ]
    },
    ground: {
      color: 'from-purple-600',
      gradient: 'bg-gradient-to-t from-purple-700 to-purple-500'
    },
    weather: { type: 'sparkles', intensity: 'medium', color: 'rainbow' },
    cost: 220,
    owned: false
  },

  {
    id: 'aurora',
    name: 'Aurora Borealis',
    description: 'Mystical northern lights',
    category: 'special',
    sky: {
      gradient: 'bg-gradient-to-b from-purple-900 via-green-400 to-blue-800',
      elements: [
        { id: 'star1', emoji: '⭐', position: { x: 'left-8', y: 'top-4' }, size: 'text-lg', animation: 'animate-pulse' },
        { id: 'star2', emoji: '✨', position: { x: 'right-12', y: 'top-6' }, size: 'text-xl', animation: 'animate-spin-slow' },
        { id: 'star3', emoji: '🌟', position: { x: 'left-16', y: 'top-10' }, size: 'text-lg', animation: 'animate-pulse' },
      ]
    },
    ground: {
      color: 'from-indigo-700',
      gradient: 'bg-gradient-to-t from-indigo-800 to-indigo-600'
    },
    weather: { type: 'sparkles', intensity: 'light', color: 'aurora' },
    cost: 280,
    owned: false
  }
];

export const getThemesByCategory = (category: string) => {
  return backgroundThemes.filter(theme => theme.category === category);
};

export const getOwnedThemes = () => {
  return backgroundThemes.filter(theme => theme.owned);
};

export const getThemeById = (id: string) => {
  return backgroundThemes.find(theme => theme.id === id);
};