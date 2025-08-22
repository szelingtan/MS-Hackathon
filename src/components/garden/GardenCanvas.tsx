import { useDroppable } from '@dnd-kit/core';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { GardenPlant } from './GardenPlant';
import { GardenAccessory } from './GardenAccessory';
import { PlantInstance, Plant, Accessory, AccessoryInstance, Position } from '@/types/garden';
import { BackgroundTheme } from '@/types/themes';
import { getThemeById } from '@/data/backgroundThemes';

interface GardenCanvasProps {
  plants: PlantInstance[];
  gardenAccessories: AccessoryInstance[]; // NEW: independent accessories
  plantData: Plant[];
  accessories: Accessory[];
  isEditMode: boolean;
  backgroundTheme: string;
  selectedAccessory?: string | null;
  placementMode?: 'plant' | 'accessory' | null;
  onPlantMove: (plantId: string, position: Position) => void;
  onPlantRemove: (plantId: string) => void;
  onPlantConfirmPlacement: (plantId: string) => void;
  onPlantClickForAccessory?: (plantId: string) => void;
  onRemoveAccessoryFromPlant?: (plantId: string, accessoryId: string) => void;
  onAddPlant?: (plantId: string, position: Position) => void;
  // NEW: Independent accessory handlers
  onAccessoryMove?: (accessoryId: string, position: Position) => void;
  onAccessoryRemove?: (accessoryId: string) => void;
  onAccessoryConfirmPlacement?: (accessoryId: string) => void;
  onAddAccessory?: (accessoryId: string, position: Position) => void;
}

export const GardenCanvas = ({
  plants,
  gardenAccessories,
  plantData,
  accessories,
  isEditMode,
  backgroundTheme,
  selectedAccessory,
  placementMode,
  onPlantMove,
  onPlantRemove,
  onPlantConfirmPlacement,
  onPlantClickForAccessory,
  onRemoveAccessoryFromPlant,
  onAddPlant,
  onAccessoryMove,
  onAccessoryRemove,
  onAccessoryConfirmPlacement,
  onAddAccessory
}: GardenCanvasProps) => {
  const [draggedPlant, setDraggedPlant] = useState<PlantInstance | null>(null);
  const [draggedAccessory, setDraggedAccessory] = useState<AccessoryInstance | null>(null);
  const theme = getThemeById(backgroundTheme);

  const { setNodeRef } = useDroppable({
    id: 'garden-canvas',
  });

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag Start Event:', event);
    
    // Check if it's a plant or accessory being dragged
    const plant = plants.find(p => p.id === event.active.id);
    const accessory = (gardenAccessories || []).find(a => a.id === event.active.id);
    
    if (plant) {
      console.log('Found Plant for Drag:', plant);
      setDraggedPlant(plant);
      setDraggedAccessory(null);
    } else if (accessory) {
      console.log('Found Accessory for Drag:', accessory);
      setDraggedAccessory(accessory);
      setDraggedPlant(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('Drag End Event:', event);
    const { active, delta, over } = event;
    
    if (active && over && over.id === 'garden-canvas') {
      const dragData = active.data.current;
      
      if (dragData?.source === 'palette' && onAddPlant) {
        // Dragging from palette - add new plant at center for now
        const centerPosition = {
          x: 400, // Center of 800px canvas
          y: 200  // Center of 400px canvas
        };
        
        if (dragData.plantId) {
          onAddPlant(dragData.plantId, centerPosition);
        }
      } else if (active && delta) {
        // Check if dragging plant or accessory
        const plant = plants.find(p => p.id === active.id);
        const accessory = (gardenAccessories || []).find(a => a.id === active.id);
        
        if (plant && onPlantMove) {
          // Dragging existing plant
          const newPosition = {
            x: plant.position.x + delta.x,
            y: plant.position.y + delta.y
          };
          onPlantMove(plant.id, newPosition);
        } else if (accessory && onAccessoryMove) {
          // Dragging existing accessory
          const newPosition = {
            x: accessory.position.x + delta.x,
            y: accessory.position.y + delta.y
          };
          onAccessoryMove(accessory.id, newPosition);
        }
      }
    }
    
    setDraggedPlant(null);
    setDraggedAccessory(null);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Don't add items if clicking on existing plants/accessories or during drag operations
    if (!isEditMode || (draggedPlant || draggedAccessory)) return;
    
    // Check if click target is a plant or accessory
    const target = event.target as HTMLElement;
    if (target.closest('[data-plant-id]') || target.closest('[data-accessory-id]')) {
      return; // Clicked on existing item, don't add new item
    }
    
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    
    // Handle placement based on mode and selection
    if (placementMode === 'accessory' && selectedAccessory && onAddAccessory) {
      onAddAccessory(selectedAccessory, position);
    } else if (placementMode === 'plant' && onAddPlant) {
      // Add selected plant or default to first owned plant
      const ownedPlant = plantData.find(p => p.owned);
      if (ownedPlant) {
        onAddPlant(ownedPlant.id, position);
      }
    } else if (!placementMode && onAddPlant) {
      // Default behavior - add plant
      const ownedPlant = plantData.find(p => p.owned);
      if (ownedPlant) {
        onAddPlant(ownedPlant.id, position);
      }
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        ref={setNodeRef}
        onClick={handleCanvasClick}
        className={`relative w-full h-80 rounded-lg overflow-hidden ${isEditMode ? 'cursor-crosshair' : 'cursor-default'} ${theme?.sky.gradient || 'bg-gradient-to-b from-blue-100 to-green-100'}`}
        style={{ minHeight: '400px' }}
      >
        {/* Dynamic Sky Elements */}
        {theme?.sky.elements.map((element) => (
          <div
            key={element.id}
            className={`absolute ${element.position.x} ${element.position.y} ${element.size} ${element.animation || ''}`}
            style={{ opacity: element.opacity || 1 }}
          >
            {element.emoji}
          </div>
        ))}
        
        {/* Dynamic Ground */}
        <div className={`absolute bottom-0 left-0 right-0 h-6 rounded-b-lg ${theme?.ground.gradient || 'bg-gradient-to-t from-amber-700 to-amber-500'}`}></div>
        
        {/* Edit Mode Grid Overlay */}
        {isEditMode && (
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="w-full h-full opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #888 1px, transparent 1px),
                  linear-gradient(to bottom, #888 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
          </div>
        )}

        {/* Edit Mode Instructions */}
        {isEditMode && plants.length === 0 && gardenAccessories.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 px-6 py-4 rounded-lg text-center shadow-lg">
              <p className="text-sm text-gray-600">Click anywhere to add items</p>
              <p className="text-xs text-gray-500">Drag items to move them around</p>
            </div>
          </div>
        )}

        {/* Render Plants */}
        {plants.map((plantInstance) => {
          const plant = plantData.find(p => p.id === plantInstance.plantId);
          if (!plant) return null;

          const hasAccessorySelected = selectedAccessory && isEditMode;

          return (
            <GardenPlant
              key={plantInstance.id}
              plantInstance={plantInstance}
              plantData={plant}
              accessories={accessories}
              isEditMode={isEditMode}
              hasAccessorySelected={hasAccessorySelected}
              onRemove={() => onPlantRemove(plantInstance.id)}
              onDoubleClick={() => onPlantRemove(plantInstance.id)}
              onConfirmPlacement={() => onPlantConfirmPlacement(plantInstance.id)}
              onClickForAccessory={() => onPlantClickForAccessory?.(plantInstance.id)}
              onRemoveAccessory={(accessoryId) => onRemoveAccessoryFromPlant?.(plantInstance.id, accessoryId)}
            />
          );
        })}

        {/* Render Independent Accessories */}
        {(gardenAccessories || []).map((accessoryInstance) => {
          const accessory = accessories.find(a => a.id === accessoryInstance.accessoryId);
          if (!accessory) return null;

          return (
            <GardenAccessory
              key={accessoryInstance.id}
              accessoryInstance={accessoryInstance}
              accessoryData={accessory}
              isEditMode={isEditMode}
              onRemove={() => onAccessoryRemove?.(accessoryInstance.id)}
              onDoubleClick={() => onAccessoryRemove?.(accessoryInstance.id)}
              onConfirmPlacement={() => onAccessoryConfirmPlacement?.(accessoryInstance.id)}
            />
          );
        })}

        {/* Drag Overlay */}
        <DragOverlay>
          {draggedPlant && (
            <div style={{ fontSize: '80px', opacity: 0.8 }}>
              {plantData.find(p => p.id === draggedPlant.plantId)?.emoji}
            </div>
          )}
          {draggedAccessory && (
            <div style={{ fontSize: '40px', opacity: 0.8 }}>
              {accessories.find(a => a.id === draggedAccessory.accessoryId)?.emoji}
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};