import { useState, useCallback, useEffect } from 'react';
import { PlantInstance, GardenLayout, Position, AccessoryInstance } from '@/types/garden';
import { useGardenBackend } from './useGardenBackend';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export const useGardenLayout = (userId?: string) => {
  const { saveGarden, loadGarden, initialized } = useGardenBackend();
  
  const [gardenLayout, setGardenLayout] = useState<GardenLayout>({
    id: 'default',
    userId,
    plants: [
      {
        id: 'plant-1',
        plantId: 'seedling',
        position: { x: 400, y: 300 },
        size: 1.0,
        rotation: 0,
        layer: 1,
        accessories: ['crown'] // Keep for backward compatibility
      }
    ],
    accessories: [], // NEW: independent accessories array
    backgroundTheme: 'noon', // Default to bright day theme
    canvas: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    },
    lastModified: new Date(),
  });

  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load garden from backend when initialized
  useEffect(() => {
    const loadGardenData = async () => {
      if (!initialized || !userId) return;
      
      setIsLoading(true);
      try {
        const savedGarden = await loadGarden();
        if (savedGarden) {
          // Migration: ensure accessories property exists
          const migratedGarden = {
            ...savedGarden,
            accessories: savedGarden.accessories || [] // Default to empty array if not present
          };
          setGardenLayout(migratedGarden);
        }
      } catch (error) {
        console.error('Error loading garden:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGardenData();
  }, [initialized, userId, loadGarden]);

  // Auto-save garden changes with debounce
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const debouncedSave = useCallback((garden: GardenLayout) => {
    if (!userId || !initialized) return;
    
    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    // Set new timeout for auto-save
    const timeout = setTimeout(async () => {
      try {
        await saveGarden(garden);
        console.log('Garden auto-saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000); // Save after 2 seconds of inactivity
    
    setSaveTimeout(timeout);
  }, [userId, initialized, saveGarden, saveTimeout]);

  const addPlant = useCallback((plantId: string, position: Position, placementMode: boolean = false) => {
    const newPlant: PlantInstance = {
      id: `plant-${Date.now()}`,
      plantId,
      position,
      size: 1.0,
      rotation: 0,
      layer: gardenLayout.plants.length + 1,
      accessories: [],
      isPlacementMode: placementMode
    };

    const updatedGarden = {
      ...gardenLayout,
      plants: [...gardenLayout.plants, newPlant],
      lastModified: new Date()
    };
    
    setGardenLayout(updatedGarden);
    debouncedSave(updatedGarden);
  }, [gardenLayout, debouncedSave]);

  const addPlantToCenter = useCallback((plantId: string) => {
    const centerPosition = { x: 400, y: 200 }; // Center of canvas
    addPlant(plantId, centerPosition, true);
  }, [addPlant]);

  const confirmPlantPlacement = useCallback((plantInstanceId: string) => {
    const updatedGarden = {
      ...gardenLayout,
      plants: gardenLayout.plants.map(plant =>
        plant.id === plantInstanceId
          ? { ...plant, isPlacementMode: false }
          : plant
      ),
      lastModified: new Date()
    };
    
    setGardenLayout(updatedGarden);
    debouncedSave(updatedGarden);
  }, [gardenLayout, debouncedSave]);

  const updatePlantPosition = useCallback((plantInstanceId: string, position: Position) => {
    // Ensure plant stays within canvas bounds
    const clampedPosition = {
      x: Math.max(50, Math.min(CANVAS_WIDTH - 50, position.x)),
      y: Math.max(50, Math.min(CANVAS_HEIGHT - 50, position.y))
    };

    const updatedGarden = {
      ...gardenLayout,
      plants: gardenLayout.plants.map(plant =>
        plant.id === plantInstanceId
          ? { ...plant, position: clampedPosition }
          : plant
      ),
      lastModified: new Date()
    };
    
    setGardenLayout(updatedGarden);
    debouncedSave(updatedGarden);
  }, [gardenLayout, debouncedSave]);

  const removePlant = useCallback((plantInstanceId: string) => {
    const updatedGarden = {
      ...gardenLayout,
      plants: gardenLayout.plants.filter(plant => plant.id !== plantInstanceId),
      lastModified: new Date()
    };
    
    setGardenLayout(updatedGarden);
    debouncedSave(updatedGarden);
  }, [gardenLayout, debouncedSave]);

  const updatePlantAccessories = useCallback((plantInstanceId: string, accessories: string[]) => {
    const updatedGarden = {
      ...gardenLayout,
      plants: gardenLayout.plants.map(plant =>
        plant.id === plantInstanceId
          ? { ...plant, accessories }
          : plant
      ),
      lastModified: new Date()
    };
    
    setGardenLayout(updatedGarden);
    debouncedSave(updatedGarden);
  }, [gardenLayout, debouncedSave]);

  const clearGarden = useCallback(() => {
    const updatedGarden = {
      ...gardenLayout,
      plants: [],
      accessories: [], // Clear accessories too
      lastModified: new Date()
    };
    
    setGardenLayout(updatedGarden);
    debouncedSave(updatedGarden);
  }, [gardenLayout, debouncedSave]);

  // NEW: Accessory management functions
  const addAccessory = useCallback((accessoryId: string, position: Position, placementMode: boolean = false) => {
    const newAccessory: AccessoryInstance = {
      id: `accessory-${Date.now()}`,
      accessoryId,
      position,
      size: 1.0,
      rotation: 0,
      layer: gardenLayout.accessories.length + gardenLayout.plants.length + 1,
      isPlacementMode: placementMode
    };

    const updatedGarden = {
      ...gardenLayout,
      accessories: [...gardenLayout.accessories, newAccessory],
      lastModified: new Date()
    };
    
    setGardenLayout(updatedGarden);
    debouncedSave(updatedGarden);
  }, [gardenLayout, debouncedSave]);

  const addAccessoryToCenter = useCallback((accessoryId: string) => {
    const centerPosition = { x: 400, y: 200 }; // Center of canvas
    addAccessory(accessoryId, centerPosition, true);
  }, [addAccessory]);

  const confirmAccessoryPlacement = useCallback((accessoryInstanceId: string) => {
    const updatedGarden = {
      ...gardenLayout,
      accessories: gardenLayout.accessories.map(accessory =>
        accessory.id === accessoryInstanceId
          ? { ...accessory, isPlacementMode: false }
          : accessory
      ),
      lastModified: new Date()
    };
    
    setGardenLayout(updatedGarden);
    debouncedSave(updatedGarden);
  }, [gardenLayout, debouncedSave]);

  const updateAccessoryPosition = useCallback((accessoryInstanceId: string, position: Position) => {
    // Ensure accessory stays within canvas bounds
    const clampedPosition = {
      x: Math.max(50, Math.min(CANVAS_WIDTH - 50, position.x)),
      y: Math.max(50, Math.min(CANVAS_HEIGHT - 50, position.y))
    };

    const updatedGarden = {
      ...gardenLayout,
      accessories: gardenLayout.accessories.map(accessory =>
        accessory.id === accessoryInstanceId
          ? { ...accessory, position: clampedPosition }
          : accessory
      ),
      lastModified: new Date()
    };
    
    setGardenLayout(updatedGarden);
    debouncedSave(updatedGarden);
  }, [gardenLayout, debouncedSave]);

  const removeAccessory = useCallback((accessoryInstanceId: string) => {
    const updatedGarden = {
      ...gardenLayout,
      accessories: gardenLayout.accessories.filter(accessory => accessory.id !== accessoryInstanceId),
      lastModified: new Date()
    };
    
    setGardenLayout(updatedGarden);
    debouncedSave(updatedGarden);
  }, [gardenLayout, debouncedSave]);

  const updateBackgroundTheme = useCallback((themeId: string) => {
    const updatedGarden = {
      ...gardenLayout,
      backgroundTheme: themeId,
      lastModified: new Date()
    };
    
    setGardenLayout(updatedGarden);
    debouncedSave(updatedGarden);
  }, [gardenLayout, debouncedSave]);

  const toggleEditMode = useCallback(() => {
    setEditMode(prev => !prev);
  }, []);

  return {
    gardenLayout,
    editMode,
    isLoading,
    addPlant,
    addPlantToCenter,
    confirmPlantPlacement,
    updatePlantPosition,
    removePlant,
    updatePlantAccessories,
    // NEW: Accessory management functions
    addAccessory,
    addAccessoryToCenter,
    confirmAccessoryPlacement,
    updateAccessoryPosition,
    removeAccessory,
    updateBackgroundTheme,
    clearGarden,
    toggleEditMode,
    setEditMode
  };
};