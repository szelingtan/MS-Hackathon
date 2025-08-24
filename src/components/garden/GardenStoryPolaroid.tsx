import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { StoryInstance } from '@/types/garden';
import type { ImpactStory } from '@/components/garden/StoryDetailModal';

interface GardenStoryPolaroidProps {
  instance: StoryInstance;
  story: ImpactStory;
  isEditMode: boolean;
  onClick?: () => void;            // open modal in view mode
  onRemove?: () => void;           // delete from canvas
  onConfirmPlacement?: () => void; // finish placement
}

export const GardenStoryPolaroid = ({
  instance,
  story,
  isEditMode,
  onClick,
  onRemove,
  onConfirmPlacement
}: GardenStoryPolaroidProps) => {
  const {
    attributes, listeners, setNodeRef, transform, isDragging
  } = useDraggable({
    id: instance.id,
    disabled: !isEditMode || instance.isPlacementMode,
  });

  const size = (instance.size ?? 1) * 80;       // base width of polaroid
  const imgW = size;                             // image width
  const imgH = imgW * 16 / 9;                    // keep 9:16 image inside with cover
  const framePad = 8;                            // white frame thickness
  const captionH = 18;

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.85 : 1,
    position: 'absolute',
    left: instance.position.x - (imgW / 2),
    top: instance.position.y - (imgH / 2) - captionH / 2,
    width: imgW + framePad * 2,
    cursor: isEditMode ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
    zIndex: instance.layer + (isDragging ? 120 : 0) + (instance.isPlacementMode ? 1000 : 0),
    userSelect: 'none',
    transition: isDragging ? 'none' : 'transform 120ms ease, box-shadow 120ms ease',
    filter: instance.isPlacementMode
      ? 'brightness(1.1) drop-shadow(0 0 10px rgba(250, 204, 21, 0.7))'
      : story.userDonated ? 'drop-shadow(0 0 6px rgba(234, 179, 8, 0.55))' : 'none',
  };

  const tilt = (instance.rotation ?? (story.id % 2 ? -4 : 5)); // cute default tilt

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-story-id={instance.id}
      className="relative select-none"
    >
      {/* delete button (edit mode only, not in placement) */}
      {isEditMode && onRemove && !instance.isPlacementMode && (
        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); onRemove(); }}
          onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
          onTouchStart={(e) => { e.stopPropagation(); e.preventDefault(); }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs z-20 flex items-center justify-center shadow-lg"
        >
          ×
        </button>
      )}

      <div
        {...(isEditMode && !instance.isPlacementMode ? listeners : {})}
        {...(isEditMode && !instance.isPlacementMode ? attributes : {})}
        onClick={(e) => {
          e.stopPropagation();
          if (instance.isPlacementMode && onConfirmPlacement) return onConfirmPlacement();
          if (!isEditMode && onClick) onClick();
        }}
        className={`rounded-md shadow-md bg-white border border-black/10 p-2 origin-center hover:shadow-lg`}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {/* image area */}
        <div
          className="overflow-hidden rounded-sm bg-black/5"
          style={{ width: imgW, height: imgH }}
        >
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* caption strip */}
        <div className="mt-1 text-[10px] leading-none text-center text-black/70 truncate max-w-full">
          {story.title}
        </div>

        {/* small “supported” pin */}
        {story.userDonated ? (
          <div className="absolute -left-2 -top-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-200 text-yellow-800 px-2 py-0.5 border border-yellow-300 shadow">
              ❤️ Supported
            </span>
          </div>
        ) : null}

        {/* placement tip */}
        {instance.isPlacementMode && isEditMode && (
          <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-3 py-1 rounded text-xs whitespace-nowrap animate-bounce">
            Click to place!
          </div>
        )}
      </div>
    </div>
  );
};
