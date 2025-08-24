export interface Position {
  x: number;
  y: number;
}

export interface PlantInstance {
  id: string;
  plantId: string;
  position: Position;
  size: number; // 0.8, 1.0, 1.2
  rotation: number; // 0, 45, 90
  layer: number;
  accessories: string[];
  isPlacementMode?: boolean; // For click-to-place system
}

export interface GardenLayout {
  id: string;
  userId?: string;
  plants: PlantInstance[];
  accessories: AccessoryInstance[]; // NEW: independent accessories
  backgroundTheme: string;
  canvas: {
    width: number;
    height: number;
  };
  lastModified: Date;
}

export interface Plant {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  category: 'basic' | 'garden' | 'exotic' | 'premium';
  owned: boolean;
}

export interface Accessory {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  category: 'hats' | 'glasses' | 'jewelry' | 'pots' | 'bows' | 'special';
  owned: boolean;
}

export interface AccessoryInstance {
  id: string;                    // unique instance ID
  accessoryId: string;          // reference to accessory type
  position: Position;           // absolute position in garden
  rotation?: number;            // optional rotation
  size?: number;               // optional size multiplier (default 1.0)
  layer: number;               // z-index for layering
  isPlacementMode?: boolean;   // For click-to-place system
}

export interface PlantOutfit {
  hat?: string;
  glasses?: string;
  jewelry: string[];
  pot?: string;
  bow?: string;
  special?: string;
}

export interface StoryInstance {
  /** unique id for this placed polaroid on the canvas */
  id: string;
  /** which ImpactStory this instance points to */
  storyId: number;
  /** canvas position in px */
  position: Position;
  /** z-layer ordering (like plants/accessories) */
  layer: number;
  /** optional style controls */
  rotation?: number;   // degrees (small tilt)
  size?: number;       // scale, 1.0 = base size
  isPlacementMode?: boolean;
}
