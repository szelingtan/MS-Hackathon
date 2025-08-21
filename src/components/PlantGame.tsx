import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sprout, Droplets, TreePine, Flower } from "lucide-react";

interface PlantGameProps {
  waterDrops: number;
}

const PlantGame = ({ waterDrops }: PlantGameProps) => {
  const [plantLevel, setPlantLevel] = useState(1);
  const [plantHealth, setPlantHealth] = useState(75);
  const [isWatering, setIsWatering] = useState(false);
  
  const plantStages = [
    { 
      level: 1, 
      name: "Seedling", 
      icon: Sprout, 
      color: "text-plant-base",
      waterCost: 10,
      description: "A tiny sprout reaching for the sun" 
    },
    { 
      level: 2, 
      name: "Young Plant", 
      icon: TreePine, 
      color: "text-plant-growth",
      waterCost: 25,
      description: "Growing strong with vibrant leaves" 
    },
    { 
      level: 3, 
      name: "Flowering", 
      icon: Flower, 
      color: "text-plant-bloom",
      waterCost: 50,
      description: "Beautiful blooms showing your impact" 
    }
  ];

  const currentPlant = plantStages[Math.min(plantLevel - 1, plantStages.length - 1)];
  const nextPlant = plantStages[Math.min(plantLevel, plantStages.length - 1)];
  const canUpgrade = plantLevel < plantStages.length && waterDrops >= nextPlant.waterCost;

  const waterPlant = () => {
    if (waterDrops >= 5 && plantHealth < 100) {
      setIsWatering(true);
      setTimeout(() => {
        setPlantHealth(prev => Math.min(prev + 15, 100));
        setIsWatering(false);
      }, 1000);
    }
  };

  const upgradePlant = () => {
    if (canUpgrade) {
      setPlantLevel(prev => prev + 1);
      setPlantHealth(100);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlantHealth(prev => Math.max(prev - 1, 0));
    }, 30000); // Decrease health every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const PlantIcon = currentPlant.icon;

  return (
    <div className="space-y-6">
      {/* Plant Display */}
      <div className="flex flex-col items-center space-y-4">
        <div className={`
          relative p-8 rounded-full bg-gradient-earth 
          ${isWatering ? 'animate-plant-grow' : 'animate-leaf-sway'}
          shadow-plant
        `}>
          <PlantIcon className={`h-16 w-16 ${currentPlant.color}`} />
          
          {isWatering && (
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <Droplets className="h-6 w-6 text-water animate-water-drop" />
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Level {currentPlant.level} - {currentPlant.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {currentPlant.description}
          </p>
        </div>
      </div>

      {/* Plant Health */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Plant Health</span>
          <span className={`font-medium ${
            plantHealth > 70 ? 'text-plant-growth' :
            plantHealth > 40 ? 'text-accent' : 'text-destructive'
          }`}>
            {plantHealth}%
          </span>
        </div>
        <Progress 
          value={plantHealth} 
          className="h-2"
        />
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={waterPlant}
          disabled={waterDrops < 5 || plantHealth >= 100 || isWatering}
          className="w-full"
          variant={plantHealth < 50 ? "nature" : "outline"}
        >
          <Droplets className="h-4 w-4 mr-2" />
          Water Plant (5 drops)
        </Button>

        {canUpgrade && (
          <Button
            onClick={upgradePlant}
            className="w-full"
            variant="nature"
          >
            <Sprout className="h-4 w-4 mr-2" />
            Upgrade to {nextPlant.name} ({nextPlant.waterCost} drops)
          </Button>
        )}
      </div>

      {/* Progress to next level */}
      {plantLevel < plantStages.length && (
        <div className="text-center text-sm text-muted-foreground">
          Next upgrade: {nextPlant.waterCost - waterDrops > 0 ? 
            `${nextPlant.waterCost - waterDrops} more drops needed` :
            "Ready to upgrade!"
          }
        </div>
      )}
    </div>
  );
};

export default PlantGame;