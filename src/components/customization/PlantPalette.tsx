import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plant, Accessory } from '@/types/garden';
import { Sprout, Sparkles } from 'lucide-react';

interface PlantPaletteProps {
  plants: Plant[];
  accessories: Accessory[];
  isEditMode: boolean;
  selectedAccessory?: string | null;
  selectedPlant?: string | null;
  onPlantClick?: (plantId: string) => void;
  onAccessoryClick?: (accessoryId: string) => void;
}

export const PlantPalette = ({ plants, accessories, isEditMode, selectedAccessory, selectedPlant, onPlantClick, onAccessoryClick }: PlantPaletteProps) => {
  const ownedPlants = plants.filter(p => p.owned);
  const ownedAccessories = accessories.filter(a => a.owned);

  if (!isEditMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Badge className="bg-plant-growth text-white">Inventory</Badge>
            Your Collection ({ownedPlants.length + ownedAccessories.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Non-draggable view mode */}
          <div>
            <h5 className="font-medium mb-3 flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              Plants ({ownedPlants.length})
            </h5>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {ownedPlants.map((plant) => (
                <div key={plant.id} className="p-3 border rounded-lg bg-card text-center hover:bg-accent/50 transition-colors">
                  <div className="text-2xl mb-1">{plant.emoji}</div>
                  <div className="text-xs font-medium">{plant.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Accessories ({ownedAccessories.length})
            </h5>
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {ownedAccessories.map((accessory) => (
                <div key={accessory.id} className="p-2 border rounded-lg bg-card text-center hover:bg-accent/50 transition-colors">
                  <div className="text-xl mb-1">{accessory.emoji}</div>
                  <div className="text-xs font-medium">{accessory.name}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Badge className="bg-blue-600 text-white">Drag & Drop</Badge>
          Plant Palette
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Edit mode - clickable items */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 font-medium mb-2">🎨 Click to Add</p>
          <p className="text-xs text-green-700">Click plants to add them to the center of your garden, then drag to position!</p>
        </div>

        <div>
          <h5 className="font-medium mb-3 flex items-center gap-2">
            <Sprout className="h-4 w-4" />
            Plants ({ownedPlants.length})
          </h5>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {ownedPlants.map((plant) => {
              const isSelected = selectedPlant === plant.id;
              return (
                <div
                  key={plant.id}
                  onClick={() => onPlantClick?.(plant.id)}
                  className={`p-3 border-2 rounded-lg bg-card text-center transition-all cursor-pointer transform hover:scale-105 active:scale-95 ${
                    isSelected 
                      ? 'border-green-500 bg-green-100 shadow-lg' 
                      : 'border-border hover:bg-green-50 hover:border-green-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{plant.emoji}</div>
                  <div className="text-xs font-medium">{plant.name}</div>
                  {isSelected && (
                    <div className="text-xs text-green-600 font-semibold mt-1">Selected</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Accessories ({ownedAccessories.length})
          </h5>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {ownedAccessories.map((accessory) => {
              const isSelected = selectedAccessory === accessory.id;
              return (
                <div
                  key={accessory.id}
                  onClick={() => onAccessoryClick?.(accessory.id)}
                  className={`p-2 border-2 rounded-lg bg-card text-center transition-all cursor-pointer transform hover:scale-105 active:scale-95 ${
                    isSelected 
                      ? 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-300' 
                      : 'hover:bg-green-50 hover:border-green-300'
                  }`}
                >
                  <div className="text-xl mb-1">{accessory.emoji}</div>
                  <div className="text-xs font-medium">{accessory.name}</div>
                  {isSelected && (
                    <div className="text-xs text-yellow-700 font-bold mt-1">Selected</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};