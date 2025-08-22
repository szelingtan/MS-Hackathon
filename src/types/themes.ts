export interface BackgroundTheme {
  id: string;
  name: string;
  description: string;
  category: 'time' | 'weather' | 'season' | 'environment' | 'special';
  sky: {
    gradient: string;
    elements: SkyElement[];
  };
  ground: {
    color: string;
    gradient: string;
  };
  weather?: WeatherEffect;
  cost: number;
  owned: boolean;
}

export interface SkyElement {
  id: string;
  emoji: string;
  position: { x: string; y: string }; // CSS position values like "10%", "right-6"
  size: string; // text size like "text-3xl"
  animation?: string; // animation classes
  opacity?: number;
}

export interface WeatherEffect {
  type: 'rain' | 'snow' | 'leaves' | 'butterflies' | 'sparkles';
  intensity: 'light' | 'medium' | 'heavy';
  color?: string;
}