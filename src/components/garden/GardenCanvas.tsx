import { getThemeById } from '@/data/backgroundThemes';
import { Accessory, AccessoryInstance, Plant, PlantInstance, Position } from '@/types/garden';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import { GardenAccessory } from './GardenAccessory';
import { GardenPlant } from './GardenPlant';

interface GardenCanvasProps {
  plants: PlantInstance[];
  gardenAccessories: AccessoryInstance[];
  plantData: Plant[];
  accessories: Accessory[];
  isEditMode: boolean;
  backgroundTheme: string;
  selectedAccessory?: string | null;
  selectedPlant?: string | null;
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
  selectedPlant,
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
    const { active, delta } = event;

    if (!active) {
      setDraggedPlant(null);
      setDraggedAccessory(null);
      return;
    }

    // Handle dragging existing items (plants and accessories)
    if (delta && (delta.x !== 0 || delta.y !== 0)) {
      console.log('Delta detected:', delta);
      
      // Check if dragging a plant
      const plant = plants.find(p => p.id === active.id);
      if (plant && onPlantMove) {
        console.log('Moving plant:', plant.id, 'from:', plant.position);
        
        // Calculate new position with bounds checking
        const canvasRect = document.getElementById('garden-canvas')?.getBoundingClientRect();
        const canvasWidth = canvasRect?.width || 800;
        const canvasHeight = canvasRect?.height || 400;
        
        let newX = plant.position.x + delta.x;
        let newY = plant.position.y + delta.y;
        
        // Keep plant within canvas bounds (with padding)
        newX = Math.max(40, Math.min(canvasWidth - 40, newX));
        newY = Math.max(40, Math.min(canvasHeight - 60, newY)); // Extra padding for ground
        
        const newPosition = { x: newX, y: newY };
        console.log('New position:', newPosition);
        
        // Call the move handler
        onPlantMove(plant.id, newPosition);
      }
      
      // Check if dragging an accessory
      const accessory = (gardenAccessories || []).find(a => a.id === active.id);
      if (accessory && onAccessoryMove) {
        console.log('Moving accessory:', accessory.id, 'from:', accessory.position);
        
        // Calculate new position with bounds checking
        const canvasRect = document.getElementById('garden-canvas')?.getBoundingClientRect();
        const canvasWidth = canvasRect?.width || 800;
        const canvasHeight = canvasRect?.height || 400;
        
        let newX = accessory.position.x + delta.x;
        let newY = accessory.position.y + delta.y;
        
        // Keep accessory within canvas bounds (with padding)
        newX = Math.max(20, Math.min(canvasWidth - 20, newX));
        newY = Math.max(20, Math.min(canvasHeight - 40, newY));
        
        const newPosition = { x: newX, y: newY };
        console.log('New accessory position:', newPosition);
        
        // Call the move handler
        onAccessoryMove(accessory.id, newPosition);
      }
    }

    // Reset drag state
    setDraggedPlant(null);
    setDraggedAccessory(null);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Don't add items if clicking on existing plants/accessories or during drag operations
    if (!isEditMode || (draggedPlant || draggedAccessory)) return;

    const target = event.target as HTMLElement;
    if (target.closest('[data-plant-id]') || target.closest('[data-accessory-id]')) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    if (placementMode === 'accessory' && selectedAccessory && onAddAccessory) {
      console.log('Adding accessory:', selectedAccessory, 'at position:', position);
      onAddAccessory(selectedAccessory, position);
    } else if (placementMode === 'plant' && selectedPlant && onAddPlant) {
      console.log('Adding plant:', selectedPlant, 'at position:', position);
      onAddPlant(selectedPlant, position);
    } else if (!placementMode) {
      // Only add plant if one is selected, don't default to first owned
      if (selectedPlant && onAddPlant) {
        console.log('Adding selected plant:', selectedPlant, 'at position:', position);
        onAddPlant(selectedPlant, position);
      } else if (selectedAccessory && onAddAccessory) {
        console.log('Adding selected accessory:', selectedAccessory, 'at position:', position);
        onAddAccessory(selectedAccessory, position);
      }
      // Don't add anything if nothing is selected
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        ref={setNodeRef}
        id="garden-canvas" // Add ID for bounds calculation
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

        <div className={`absolute bottom-0 left-0 right-0 h-6 rounded-b-lg ${theme?.ground.gradient || 'bg-gradient-to-t from-amber-700 to-amber-500'}`}></div>

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

        {plants.map((plantInstance) => {
          const plant = plantData.find(p => p.id === plantInstance.plantId);
          if (!plant) return null;

          const hasAccessorySelected = selectedAccessory && isEditMode;

          return (
            <GardenPlant
              key={`plant-${plantInstance.id}-${plantInstance.position.x}-${plantInstance.position.y}`} // Force re-render on position change
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
              key={`accessory-${accessoryInstance.id}-${accessoryInstance.position.x}-${accessoryInstance.position.y}`} // Force re-render on position change
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