import { Accessory, Plant, PlantInstance } from '@/types/garden';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface GardenPlantProps {
  plantInstance: PlantInstance;
  plantData: Plant;
  accessories: Accessory[];
  isEditMode: boolean;
  hasAccessorySelected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  onDoubleClick?: () => void;
  onConfirmPlacement?: () => void;
  onClickForAccessory?: () => void;
  onRemoveAccessory?: (accessoryId: string) => void;
}

export const GardenPlant = ({ 
  plantInstance, 
  plantData, 
  accessories, 
  isEditMode,
  hasAccessorySelected,
  onClick,
  onRemove,
  onDoubleClick,
  onConfirmPlacement,
  onClickForAccessory,
  onRemoveAccessory
}: GardenPlantProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: plantInstance.id,
    disabled: !isEditMode,
  });

  // Debug logging
  console.log('GardenPlant Debug:', {
    plantId: plantInstance.id,
    isEditMode,
    disabled: !isEditMode,
    isDragging,
    transform,
    listeners: !!listeners,
    attributes: !!attributes
  });

  const isPlacementMode = plantInstance.isPlacementMode && isEditMode;

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    position: 'absolute' as const,
    left: plantInstance.position.x - 40, // Center the plant
    top: plantInstance.position.y - 40,
    fontSize: `${plantInstance.size * 80}px`,
    cursor: isEditMode ? (hasAccessorySelected ? 'crosshair' : 'grab') : 'pointer',
    zIndex: plantInstance.layer + (isPlacementMode ? 1000 : 0), // Bring placement plants to front
    userSelect: 'none' as const,
    transition: isDragging ? 'none' : 'all 0.2s ease',
    filter: isPlacementMode 
      ? 'brightness(1.2) drop-shadow(0 0 10px rgba(34, 197, 94, 0.6))' 
      : hasAccessorySelected 
        ? 'brightness(1.1) drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))' 
        : 'none',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Prioritize drag over clicks in edit mode
    if (isEditMode && !hasAccessorySelected && !isPlacementMode) {
      return; // Allow drag to take precedence
    }
    
    if (isPlacementMode && onConfirmPlacement) {
      onConfirmPlacement();
    } else if (hasAccessorySelected && onClickForAccessory) {
      onClickForAccessory();
    } else if (onClick) {
      onClick();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDoubleClick) {
      onDoubleClick();
    }
  };

  const rotationStyle = {
    transform: `rotate(${plantInstance.rotation}deg)`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-plant-id={plantInstance.id}
      className={`relative flex flex-col items-center ${isPlacementMode ? 'animate-pulse' : ''}`}
    >
      {/* Remove button in edit mode - Outside of draggable area */}
      {isEditMode && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('Delete button clicked for plant:', plantInstance.id);
            onRemove();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs z-20 flex items-center justify-center shadow-lg cursor-pointer"
        >
          ×
        </button>
      )}

      {/* Draggable plant content */}
      <div
        {...listeners}
        {...attributes}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className="cursor-grab active:cursor-grabbing"
      >

      {/* Hat accessory */}
      {plantInstance.accessories.some(accId => accessories.find(a => a.id === accId && a.category === 'hats')) && (
        <div className="absolute -top-4 text-2xl animate-bounce z-10 group">
          {accessories.find(a => plantInstance.accessories.includes(a.id) && a.category === 'hats')?.emoji}
          {isEditMode && onRemoveAccessory && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const hatId = plantInstance.accessories.find(accId => accessories.find(a => a.id === accId && a.category === 'hats'));
                if (hatId) onRemoveAccessory(hatId);
              }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Glasses overlay */}
      {plantInstance.accessories.some(acc => accessories.find(a => a.id === acc && a.category === 'glasses')) && (
        <div className="absolute top-2 text-xl z-10">
          {accessories.find(a => plantInstance.accessories.includes(a.id) && a.category === 'glasses')?.emoji}
        </div>
      )}

      {/* Main plant */}
      <div style={rotationStyle} className="relative">
        {plantData.emoji}
        
        {/* Jewelry around plant */}
        {plantInstance.accessories
          .filter(accId => accessories.find(a => a.id === accId && a.category === 'jewelry'))
          .map((jewelryId, idx) => (
            <div
              key={jewelryId}
              className={`absolute text-lg animate-spin-slow ${
                idx === 0 ? 'top-1 left-8' :
                idx === 1 ? 'top-4 right-8' :
                'top-2 left-4'
              }`}
            >
              {accessories.find(a => a.id === jewelryId)?.emoji}
            </div>
          ))}

        {/* Bow */}
        {plantInstance.accessories.some(acc => accessories.find(a => a.id === acc && a.category === 'bows')) && (
          <div className="absolute -top-2 right-2 text-lg">
            {accessories.find(a => plantInstance.accessories.includes(a.id) && a.category === 'bows')?.emoji}
          </div>
        )}

        {/* Special effects */}
        {plantInstance.accessories.some(acc => accessories.find(a => a.id === acc && a.category === 'special')) && (
          <div className="absolute inset-0 text-2xl animate-pulse opacity-70 flex items-center justify-center">
            {accessories.find(a => plantInstance.accessories.includes(a.id) && a.category === 'special')?.emoji}
          </div>
        )}
      </div>
      </div>

      {/* Placement mode indicator */}
      {isPlacementMode && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded text-xs whitespace-nowrap animate-bounce">
          Click to place!
        </div>
      )}

      {/* Accessory placement indicator */}
      {hasAccessorySelected && isEditMode && !isPlacementMode && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-3 py-1 rounded text-xs whitespace-nowrap animate-bounce">
          Click to decorate!
        </div>
      )}

      {/* Plant name tooltip on hover */}
      {!isEditMode && !isPlacementMode && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          {plantData.name}
        </div>
      )}
    </div>
  );
};