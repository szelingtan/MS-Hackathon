import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { AccessoryInstance, Accessory } from '@/types/garden';

interface GardenAccessoryProps {
  accessoryInstance: AccessoryInstance;
  accessoryData: Accessory;
  isEditMode: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  onDoubleClick?: () => void;
  onConfirmPlacement?: () => void;
}

export const GardenAccessory = ({ 
  accessoryInstance, 
  accessoryData, 
  isEditMode,
  onClick,
  onRemove,
  onDoubleClick,
  onConfirmPlacement
}: GardenAccessoryProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: accessoryInstance.id,
    disabled: !isEditMode,
  });

  // Debug logging
  console.log('GardenAccessory Debug:', {
    accessoryId: accessoryInstance.id,
    isEditMode,
    disabled: !isEditMode,
    isDragging,
    transform,
    listeners: !!listeners,
    attributes: !!attributes
  });

  const isPlacementMode = accessoryInstance.isPlacementMode && isEditMode;

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    position: 'absolute' as const,
    left: accessoryInstance.position.x - 20, // Center the accessory
    top: accessoryInstance.position.y - 20,
    fontSize: `${(accessoryInstance.size || 1.0) * 40}px`,
    cursor: isEditMode ? 'grab' : 'pointer',
    zIndex: accessoryInstance.layer + (isPlacementMode ? 1000 : 0),
    userSelect: 'none' as const,
    transition: isDragging ? 'none' : 'all 0.2s ease',
    filter: isPlacementMode 
      ? 'brightness(1.2) drop-shadow(0 0 10px rgba(251, 191, 36, 0.6))' 
      : 'none',
  };

  const rotationStyle = {
    transform: `rotate(${accessoryInstance.rotation || 0}deg)`,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPlacementMode && onConfirmPlacement) {
      onConfirmPlacement();
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-accessory-id={accessoryInstance.id}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`relative flex flex-col items-center ${isPlacementMode ? 'animate-pulse' : ''}`}
    >
      {/* Remove button in edit mode */}
      {isEditMode && onRemove && !isPlacementMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs z-10 flex items-center justify-center"
        >
          ×
        </button>
      )}

      {/* Main accessory */}
      <div style={rotationStyle} className="relative">
        {accessoryData.emoji}
      </div>

      {/* Placement mode indicator */}
      {isPlacementMode && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-3 py-1 rounded text-xs whitespace-nowrap animate-bounce">
          Click to place!
        </div>
      )}

      {/* Accessory name tooltip on hover */}
      {!isEditMode && !isPlacementMode && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          {accessoryData.name}
        </div>
      )}
    </div>
  );
};
