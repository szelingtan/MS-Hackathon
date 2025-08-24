import { getThemeById } from '@/data/backgroundThemes';
import { Accessory, AccessoryInstance, Plant, PlantInstance, Position } from '@/types/garden';
import { StoryInstance } from '@/types/garden';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDroppable } from '@dnd-kit/core';
import { useMemo, useState } from 'react';
import { GardenAccessory } from './GardenAccessory';
import { GardenPlant } from './GardenPlant';
import { GardenStoryPolaroid } from './GardenStoryPolaroid';
import { StoryDetailModal, ImpactStory } from '@/components/garden/StoryDetailModal';

interface GardenCanvasProps {
  plants: PlantInstance[];
  gardenAccessories: AccessoryInstance[];
  plantData: Plant[];
  accessories: Accessory[];

  /** NEW: stories + placed polaroids */
  impactStories?: ImpactStory[];
  storyInstances?: StoryInstance[];

  isEditMode: boolean;
  backgroundTheme: string;

  selectedAccessory?: string | null;
  selectedPlant?: string | null;
  /** NEW: id of story to place */
  selectedStoryId?: number | null;

  /** now accepts 'story' */
  placementMode?: 'plant' | 'accessory' | 'story' | null;

  onPlantMove: (plantId: string, position: Position) => void;
  onPlantRemove: (plantId: string) => void;
  onPlantConfirmPlacement: (plantId: string) => void;
  onPlantClickForAccessory?: (plantId: string) => void;
  onRemoveAccessoryFromPlant?: (plantId: string, accessoryId: string) => void;
  onAddPlant?: (plantId: string, position: Position) => void;

  // Accessory handlers
  onAccessoryMove?: (accessoryId: string, position: Position) => void;
  onAccessoryRemove?: (accessoryId: string) => void;
  onAccessoryConfirmPlacement?: (accessoryId: string) => void;
  onAddAccessory?: (accessoryId: string, position: Position) => void;

  // NEW: Story handlers
  onStoryMove?: (instanceId: string, position: Position) => void;
  onStoryRemove?: (instanceId: string) => void;
  onStoryConfirmPlacement?: (instanceId: string) => void;
  onAddStory?: (storyId: number, position: Position) => void;
}

export const GardenCanvas = ({
  plants,
  gardenAccessories,
  plantData,
  accessories,
  impactStories = [],
  storyInstances = [],
  isEditMode,
  backgroundTheme,
  selectedAccessory,
  selectedPlant,
  selectedStoryId,
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
  onAddAccessory,
  onStoryMove,
  onStoryRemove,
  onStoryConfirmPlacement,
  onAddStory
}: GardenCanvasProps) => {
  const [draggedPlant, setDraggedPlant] = useState<PlantInstance | null>(null);
  const [draggedAccessory, setDraggedAccessory] = useState<AccessoryInstance | null>(null);
  const [draggedStory, setDraggedStory] = useState<StoryInstance | null>(null);

  const [openStory, setOpenStory] = useState<ImpactStory | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  const openStoryModal = (story: ImpactStory) => { setOpenStory(story); setIsStoryModalOpen(true); };
  const closeStoryModal = () => { setIsStoryModalOpen(false); setOpenStory(null); };

  const theme = getThemeById(backgroundTheme);

  const { setNodeRef } = useDroppable({ id: 'garden-canvas' });

  const storyById = useMemo(() => {
    const map = new Map<number, ImpactStory>();
    impactStories.forEach(s => map.set(s.id, s));
    return map;
  }, [impactStories]);

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id;
    const plant = plants.find(p => p.id === id);
    const accessory = (gardenAccessories || []).find(a => a.id === id);
    const story = (storyInstances || []).find(s => s.id === id);

    if (plant) { setDraggedPlant(plant); setDraggedAccessory(null); setDraggedStory(null); }
    else if (accessory) { setDraggedAccessory(accessory); setDraggedPlant(null); setDraggedStory(null); }
    else if (story) { setDraggedStory(story); setDraggedPlant(null); setDraggedAccessory(null); }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!active) {
      setDraggedPlant(null); setDraggedAccessory(null); setDraggedStory(null);
      return;
    }
    if (delta && (delta.x !== 0 || delta.y !== 0)) {
      const canvasRect = document.getElementById('garden-canvas')?.getBoundingClientRect();
      const canvasWidth = canvasRect?.width || 800;
      const canvasHeight = canvasRect?.height || 400;

      // plants
      const plant = plants.find(p => p.id === active.id);
      if (plant && onPlantMove) {
        let newX = plant.position.x + delta.x;
        let newY = plant.position.y + delta.y;
        newX = Math.max(40, Math.min(canvasWidth - 40, newX));
        newY = Math.max(40, Math.min(canvasHeight - 60, newY));
        onPlantMove(plant.id, { x: newX, y: newY });
      }

      // accessories
      const accessory = (gardenAccessories || []).find(a => a.id === active.id);
      if (accessory && onAccessoryMove) {
        let newX = accessory.position.x + delta.x;
        let newY = accessory.position.y + delta.y;
        newX = Math.max(20, Math.min(canvasWidth - 20, newX));
        newY = Math.max(20, Math.min(canvasHeight - 40, newY));
        onAccessoryMove(accessory.id, { x: newX, y: newY });
      }

      // stories (polaroids)
      const storyInst = (storyInstances || []).find(s => s.id === active.id);
      if (storyInst && onStoryMove) {
        let newX = storyInst.position.x + delta.x;
        let newY = storyInst.position.y + delta.y;
        newX = Math.max(30, Math.min(canvasWidth - 30, newX));
        newY = Math.max(30, Math.min(canvasHeight - 50, newY));
        onStoryMove(storyInst.id, { x: newX, y: newY });
      }
    }
    setDraggedPlant(null); setDraggedAccessory(null); setDraggedStory(null);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode || (draggedPlant || draggedAccessory || draggedStory)) return;

    const target = event.target as HTMLElement;
    if (
      target.closest('[data-plant-id]') ||
      target.closest('[data-accessory-id]') ||
      target.closest('[data-story-id]')
    ) {
      return; // click was on an existing item
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const position = { x: event.clientX - rect.left, y: event.clientY - rect.top };

    if (placementMode === 'story' && selectedStoryId != null && onAddStory) {
      onAddStory(selectedStoryId, position);
    } else if (placementMode === 'accessory' && selectedAccessory && onAddAccessory) {
      onAddAccessory(selectedAccessory, position);
    } else if (placementMode === 'plant' && selectedPlant && onAddPlant) {
      onAddPlant(selectedPlant, position);
    } else if (!placementMode) {
      if (selectedPlant && onAddPlant) onAddPlant(selectedPlant, position);
      else if (selectedAccessory && onAddAccessory) onAddAccessory(selectedAccessory, position);
      else if (selectedStoryId != null && onAddStory) onAddStory(selectedStoryId, position);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        ref={setNodeRef}
        id="garden-canvas"
        onClick={handleCanvasClick}
        className={`relative w-full h-80 rounded-lg overflow-hidden ${isEditMode ? 'cursor-crosshair' : 'cursor-default'} ${theme?.sky.gradient || 'bg-gradient-to-b from-blue-100 to-green-100'}`}
        style={{ minHeight: '400px' }}
      >
        {/* Dynamic Sky */}
        {theme?.sky.elements.map((element) => (
          <div
            key={element.id}
            className={`absolute ${element.position.x} ${element.position.y} ${element.size} ${element.animation || ''}`}
            style={{ opacity: element.opacity || 1 }}
          >
            {element.emoji}
          </div>
        ))}

        <div className={`absolute bottom-0 left-0 right-0 h-6 rounded-b-lg ${theme?.ground.gradient || 'bg-gradient-to-t from-amber-700 to-amber-500'}`} />

        {/* Grid overlay in edit mode */}
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

        {/* Plants */}
        {plants.map((plantInstance) => {
          const plant = plantData.find(p => p.id === plantInstance.plantId);
          if (!plant) return null;
          const hasAccessorySelected = selectedAccessory && isEditMode;

          return (
            <GardenPlant
              key={`plant-${plantInstance.id}-${plantInstance.position.x}-${plantInstance.position.y}`}
              plantInstance={plantInstance}
              plantData={plant}
              accessories={accessories}
              isEditMode={isEditMode}
              hasAccessorySelected={!!hasAccessorySelected}
              onRemove={() => onPlantRemove(plantInstance.id)}
              onDoubleClick={() => onPlantRemove(plantInstance.id)}
              onConfirmPlacement={() => onPlantConfirmPlacement(plantInstance.id)}
              onClickForAccessory={() => onPlantClickForAccessory?.(plantInstance.id)}
              onRemoveAccessory={(accessoryId) => onRemoveAccessoryFromPlant?.(plantInstance.id, accessoryId)}
            />
          );
        })}

        {/* Accessories */}
        {(gardenAccessories || []).map((accessoryInstance) => {
          const accessory = accessories.find(a => a.id === accessoryInstance.accessoryId);
          if (!accessory) return null;

          return (
            <GardenAccessory
              key={`accessory-${accessoryInstance.id}-${accessoryInstance.position.x}-${accessoryInstance.position.y}`}
              accessoryInstance={accessoryInstance}
              accessoryData={accessory}
              isEditMode={isEditMode}
              onRemove={() => onAccessoryRemove?.(accessoryInstance.id)}
              onDoubleClick={() => onAccessoryRemove?.(accessoryInstance.id)}
              onConfirmPlacement={() => onAccessoryConfirmPlacement?.(accessoryInstance.id)}
            />
          );
        })}

        {/* NEW: Story Polaroids */}
        {(storyInstances || []).map((inst) => {
          const story = storyById.get(inst.storyId);
          if (!story) return null;
          return (
            <GardenStoryPolaroid
              key={`story-${inst.id}-${inst.position.x}-${inst.position.y}`}
              instance={inst}
              story={story}
              isEditMode={isEditMode}
              onRemove={() => onStoryRemove?.(inst.id)}
              onConfirmPlacement={() => onStoryConfirmPlacement?.(inst.id)}
              onClick={() => openStoryModal(story)}
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
          {draggedStory && (
            <div className="rounded-md bg-white p-2 shadow-lg border border-black/10" style={{ opacity: 0.85 }}>
              <div className="w-20 h-[90px] overflow-hidden rounded-sm bg-black/5">
                <img
                  src={storyById.get(draggedStory.storyId)?.image}
                  alt={storyById.get(draggedStory.storyId)?.title || 'Story'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-1 text-[10px] leading-none text-center text-black/70 truncate max-w-[80px]">
                {storyById.get(draggedStory.storyId)?.title}
              </div>
            </div>
          )}
        </DragOverlay>
      </div>

      {/* Shared story modal */}
      <StoryDetailModal story={openStory} isOpen={isStoryModalOpen} onClose={closeStoryModal} />
    </DndContext>
  );
};
