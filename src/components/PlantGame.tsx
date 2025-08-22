import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, Vote, Target, TrendingUp, Droplets, ShoppingCart } from "lucide-react";

interface PlantGameProps {
  waterDrops: number;
}

interface Plant {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  category: 'basic' | 'garden' | 'exotic' | 'premium';
  owned: boolean;
}

interface Accessory {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  category: 'hats' | 'glasses' | 'jewelry' | 'pots' | 'bows' | 'special';
  owned: boolean;
}

interface PlantOutfit {
  hat?: string;
  glasses?: string;
  jewelry: string[];
  pot?: string;
  bow?: string;
  special?: string;
}

const PlantGame = ({ waterDrops }: PlantGameProps) => {
  // Debug: Log when waterDrops prop changes
  useEffect(() => {
    console.log('PlantGame received waterDrops:', waterDrops);
  }, [waterDrops]);

  const [dailyVotes, setDailyVotes] = useState(47);
  const [currentRank, setCurrentRank] = useState(12);
  const [selectedPlant, setSelectedPlant] = useState<string>("seedling");
  const [plants, setPlantsData] = useState<Plant[]>([
    // Basic Plants (Free)
    { id: "seedling", name: "Seedling", emoji: "🌱", cost: 0, category: 'basic', owned: true },
    { id: "grass", name: "Grass", emoji: "🌿", cost: 0, category: 'basic', owned: true },
    
    // Garden Plants
    { id: "rose", name: "Rose", emoji: "🌸", cost: 50, category: 'garden', owned: false },
    { id: "sunflower", name: "Sunflower", emoji: "🌻", cost: 75, category: 'garden', owned: false },
    { id: "tulip", name: "Tulip", emoji: "🌷", cost: 60, category: 'garden', owned: false },
    { id: "tree", name: "Oak Tree", emoji: "🌳", cost: 100, category: 'garden', owned: false },
    { id: "hibiscus", name: "Hibiscus", emoji: "🌺", cost: 125, category: 'garden', owned: false },
    
    // Exotic Plants
    { id: "cactus", name: "Cactus", emoji: "🌵", cost: 150, category: 'exotic', owned: false },
    { id: "palm", name: "Palm Tree", emoji: "🌴", cost: 175, category: 'exotic', owned: false },
    { id: "cherry", name: "Cherry Blossom", emoji: "🌸", cost: 200, category: 'exotic', owned: false },
    
    // Premium Plants
    { id: "moon", name: "Moon Flower", emoji: "🌙", cost: 300, category: 'premium', owned: false },
    { id: "magic", name: "Magic Plant", emoji: "✨", cost: 400, category: 'premium', owned: false },
    { id: "crystal", name: "Crystal Tree", emoji: "🔮", cost: 450, category: 'premium', owned: false },
    { id: "butterfly", name: "Butterfly Bush", emoji: "🦋", cost: 350, category: 'premium', owned: false },
    { id: "rainbow", name: "Rainbow Plant", emoji: "🌈", cost: 500, category: 'premium', owned: false },
  ]);

  const [accessories, setAccessories] = useState<Accessory[]>([
    // Hats
    { id: "crown", name: "Crown", emoji: "👑", cost: 50, category: 'hats', owned: true },
    { id: "tophat", name: "Top Hat", emoji: "🎩", cost: 30, category: 'hats', owned: false },
    { id: "cap", name: "Cap", emoji: "🧢", cost: 15, category: 'hats', owned: false },
    { id: "beret", name: "Beret", emoji: "🎨", cost: 25, category: 'hats', owned: false },
    
    // Glasses
    { id: "sunglasses", name: "Cool Shades", emoji: "🕶️", cost: 20, category: 'glasses', owned: false },
    { id: "nerdglasses", name: "Nerd Glasses", emoji: "👓", cost: 25, category: 'glasses', owned: false },
    { id: "safety", name: "Safety Goggles", emoji: "🥽", cost: 15, category: 'glasses', owned: false },
    
    // Jewelry (can have multiple)
    { id: "diamond", name: "Diamond", emoji: "💎", cost: 100, category: 'jewelry', owned: false },
    { id: "star", name: "Star", emoji: "⭐", cost: 25, category: 'jewelry', owned: false },
    { id: "sparkle", name: "Sparkle", emoji: "🌟", cost: 20, category: 'jewelry', owned: false },
    { id: "gem", name: "Ruby Gem", emoji: "💍", cost: 75, category: 'jewelry', owned: false },
    
    // Pots
    { id: "ceramic", name: "Ceramic Pot", emoji: "🏺", cost: 40, category: 'pots', owned: false },
    { id: "rainbow_pot", name: "Rainbow Pot", emoji: "🎨", cost: 75, category: 'pots', owned: false },
    { id: "trophy", name: "Trophy Pot", emoji: "🏆", cost: 60, category: 'pots', owned: false },
    { id: "basket", name: "Wicker Basket", emoji: "🧺", cost: 35, category: 'pots', owned: false },
    
    // Bows
    { id: "pink_bow", name: "Pink Bow", emoji: "🎀", cost: 30, category: 'bows', owned: false },
    { id: "ribbon", name: "Ribbon", emoji: "🎗️", cost: 35, category: 'bows', owned: false },
    { id: "flower_bow", name: "Flower Bow", emoji: "🌹", cost: 45, category: 'bows', owned: false },
    
    // Special Effects
    { id: "wings", name: "Butterfly Wings", emoji: "🦋", cost: 80, category: 'special', owned: false },
    { id: "lightning", name: "Lightning", emoji: "⚡", cost: 90, category: 'special', owned: false },
    { id: "fire", name: "Fire Aura", emoji: "🔥", cost: 85, category: 'special', owned: false },
    { id: "snow", name: "Snow Effect", emoji: "❄️", cost: 70, category: 'special', owned: false },
  ]);

  const [plantOutfits, setPlantOutfits] = useState<Record<string, PlantOutfit>>({
    seedling: { jewelry: ["crown"] },
    grass: { jewelry: [] },
  });

  const challenges = [
    { id: 1, task: "Get 20 votes", progress: 17, total: 20, reward: 50, completed: false },
    { id: 2, task: "Buy new plant", progress: 0, total: 1, reward: 25, completed: false },
    { id: 3, task: "Style 3 plants", progress: 1, total: 3, reward: 30, completed: false },
  ];

  const recentActivity = [
    { id: 1, action: "Donated $50", time: "2h ago", icon: "💝" },
    { id: 2, action: "Bought Rose plant", time: "4h ago", icon: "🌸" },
    { id: 3, action: "Got 5 votes", time: "6h ago", icon: "🗳️" },
    { id: 4, action: "Styled Seedling", time: "1d ago", icon: "👑" },
  ];

  const buyPlant = (plantId: string, cost: number) => {
    if (waterDrops >= cost) {
      setPlantsData(prev => prev.map(plant => 
        plant.id === plantId ? { ...plant, owned: true } : plant
      ));
      // In real app, would deduct waterDrops
    }
  };

  const buyAccessory = (accessoryId: string, cost: number) => {
    if (waterDrops >= cost) {
      setAccessories(prev => prev.map(acc => 
        acc.id === accessoryId ? { ...acc, owned: true } : acc
      ));
      // In real app, would deduct waterDrops
    }
  };

  const equipAccessory = (plantId: string, accessoryId: string, category: string) => {
    const accessory = accessories.find(acc => acc.id === accessoryId);
    if (!accessory?.owned) return;

    setPlantOutfits(prev => {
      const outfit = prev[plantId] || { jewelry: [] };
      
      if (category === 'jewelry') {
        // Allow multiple jewelry pieces
        const newJewelry = outfit.jewelry.includes(accessoryId)
          ? outfit.jewelry.filter(id => id !== accessoryId)
          : [...outfit.jewelry, accessoryId];
        return { ...prev, [plantId]: { ...outfit, jewelry: newJewelry } };
      } else {
        // Single item categories
        const currentItem = outfit[category as keyof PlantOutfit];
        const newValue = currentItem === accessoryId ? undefined : accessoryId;
        return { ...prev, [plantId]: { ...outfit, [category]: newValue } };
      }
    });
  };

  const ownedPlants = plants.filter(p => p.owned);
  const selectedPlantData = plants.find(p => p.id === selectedPlant && p.owned);
  const currentOutfit = plantOutfits[selectedPlant] || { jewelry: [] };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Garden Scene & Plant Collection */}
      <div className="lg:col-span-2 space-y-6">
        {/* Garden Scene */}
        <Card className="shadow-plant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-plant-growth" />
              Your Garden
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Interactive Garden */}
            <div className="relative h-48 bg-gradient-to-b from-blue-100 to-green-100 rounded-lg p-6 overflow-hidden">
              {/* Sky Elements */}
              <div className="absolute top-2 right-4 text-2xl">☀️</div>
              <div className="absolute top-4 left-6 text-xl opacity-60">☁️</div>
              
              {/* Plant Display */}
              <div className="flex justify-center items-end h-full">
                <div className="relative flex flex-col items-center animate-float">
                  {/* Multi-layered accessories display */}
                  {currentOutfit.hat && (
                    <div className="text-2xl mb-1 animate-bounce">
                      {accessories.find(a => a.id === currentOutfit.hat)?.emoji}
                    </div>
                  )}
                  
                  {/* Glasses overlay */}
                  {currentOutfit.glasses && (
                    <div className="absolute top-6 text-xl z-10">
                      {accessories.find(a => a.id === currentOutfit.glasses)?.emoji}
                    </div>
                  )}
                  
                  {/* Plant with pot */}
                  <div className="relative flex flex-col items-center">
                    {/* Main plant */}
                    <div className="text-6xl relative z-5">
                      {selectedPlantData?.emoji || "🪴"}
                    </div>
                    
                    {/* Jewelry around plant */}
                    {currentOutfit.jewelry.map((jewelryId, idx) => (
                      <div key={jewelryId} className={`absolute text-lg animate-spin-slow ${
                        idx === 0 ? 'top-2 left-8' :
                        idx === 1 ? 'top-6 right-8' :
                        'top-4 left-4'
                      }`}>
                        {accessories.find(a => a.id === jewelryId)?.emoji}
                      </div>
                    ))}
                    
                    {/* Bow */}
                    {currentOutfit.bow && (
                      <div className="absolute -top-2 right-2 text-lg">
                        {accessories.find(a => a.id === currentOutfit.bow)?.emoji}
                      </div>
                    )}
                    
                    {/* Special effects */}
                    {currentOutfit.special && (
                      <div className="absolute inset-0 text-2xl animate-pulse opacity-70 flex items-center justify-center">
                        {accessories.find(a => a.id === currentOutfit.special)?.emoji}
                      </div>
                    )}
                    
                  </div>
                </div>
              </div>
              
              {/* Ground */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-amber-600 rounded-b-lg"></div>
            </div>

            {/* Plant Selector & Info */}
            <div className="mt-4 space-y-4">
              <div className="text-center">
                <Select value={selectedPlant} onValueChange={setSelectedPlant}>
                  <SelectTrigger className="w-full max-w-xs mx-auto">
                    <SelectValue placeholder="Select a plant" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownedPlants.map((plant) => (
                      <SelectItem key={plant.id} value={plant.id}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{plant.emoji}</span>
                          <span>{plant.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <h3 className="text-lg font-semibold text-foreground mt-2">
                  {selectedPlantData?.name || "Select a plant"}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plant Collection & Shop */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Plant Collection & Shop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Owned Plants */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Sprout className="h-4 w-4" />
                  Your Plants ({ownedPlants.length})
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {ownedPlants.map((plant) => (
                    <div key={plant.id} className="p-3 border rounded-lg bg-card text-center hover:bg-accent/50 transition-colors">
                      <div className="text-2xl mb-1">{plant.emoji}</div>
                      <div className="text-xs font-medium">{plant.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shop by Category */}
              {(['basic', 'garden', 'exotic', 'premium'] as const).map((category) => {
                const categoryPlants = plants.filter(p => p.category === category && !p.owned);
                if (categoryPlants.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h4 className="font-medium mb-3 capitalize flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      {category} Plants
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {categoryPlants.map((plant) => (
                        <div key={plant.id} className="p-3 border rounded-lg bg-card text-center space-y-2">
                          <div className="text-2xl">{plant.emoji}</div>
                          <div className="text-xs font-medium">{plant.name}</div>
                          <div className="text-xs text-muted-foreground">{plant.cost}💧</div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => buyPlant(plant.id, plant.cost)}
                            disabled={waterDrops < plant.cost}
                            className="w-full text-xs"
                          >
                            Buy
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Accessories Shop */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Accessory Shop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Owned Accessories */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Badge className="bg-plant-growth text-white">Owned</Badge>
                  Your Accessories
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {accessories.filter(a => a.owned).map((accessory) => (
                    <div key={accessory.id} className="p-2 border rounded-lg bg-card text-center hover:bg-accent/50 transition-colors">
                      <div className="text-xl mb-1">{accessory.emoji}</div>
                      <div className="text-xs font-medium">{accessory.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shop by Category */}
              {(['hats', 'glasses', 'jewelry', 'pots', 'bows', 'special'] as const).map((category) => {
                const categoryAccessories = accessories.filter(a => a.category === category && !a.owned);
                if (categoryAccessories.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h4 className="font-medium mb-3 capitalize flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      {category}
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {categoryAccessories.map((accessory) => (
                        <div key={accessory.id} className="p-3 border rounded-lg bg-card text-center space-y-2">
                          <div className="text-2xl">{accessory.emoji}</div>
                          <div className="text-xs font-medium">{accessory.name}</div>
                          <div className="text-xs text-muted-foreground">{accessory.cost}💧</div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => buyAccessory(accessory.id, accessory.cost)}
                            disabled={waterDrops < accessory.cost}
                            className="w-full text-xs"
                          >
                            Buy
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Plant Styling Interface */}
        {ownedPlants.length > 0 && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                🌨️ Plant Styling Studio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Selected Plant for Styling */}
                <div>
                  <h4 className="font-medium mb-2">Style Your Plant</h4>
                  <Select value={selectedPlant} onValueChange={setSelectedPlant}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose plant to style" />
                    </SelectTrigger>
                    <SelectContent>
                      {ownedPlants.map((plant) => (
                        <SelectItem key={plant.id} value={plant.id}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{plant.emoji}</span>
                            <span>{plant.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Styling Options by Category */}
                {selectedPlantData && (
                  <div className="space-y-4">
                    {(['hats', 'glasses', 'jewelry', 'pots', 'bows', 'special'] as const).map((category) => {
                      const categoryAccessories = accessories.filter(a => a.category === category && a.owned);
                      if (categoryAccessories.length === 0) return null;
                      
                      const isJewelry = category === 'jewelry';
                      const currentValue = isJewelry ? currentOutfit.jewelry : currentOutfit[category as keyof PlantOutfit];
                      
                      return (
                        <div key={category} className="space-y-2">
                          <h5 className="text-sm font-medium capitalize">{category}</h5>
                          <div className="flex gap-2 flex-wrap">
                            {/* Remove option */}
                            {!isJewelry && currentValue && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => equipAccessory(selectedPlant, "", category)}
                                className="text-xs"
                              >
                                Remove
                              </Button>
                            )}
                            
                            {/* Accessory options */}
                            {categoryAccessories.map((accessory) => {
                              const isEquipped = isJewelry 
                                ? currentOutfit.jewelry.includes(accessory.id)
                                : currentValue === accessory.id;
                              
                              return (
                                <Button
                                  key={accessory.id}
                                  size="sm"
                                  variant={isEquipped ? "nature" : "outline"}
                                  onClick={() => equipAccessory(selectedPlant, accessory.id, category)}
                                  className="text-xs flex items-center gap-1"
                                >
                                  <span>{accessory.emoji}</span>
                                  <span>{accessory.name}</span>
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Challenges & Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-accent" />
                Daily Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{challenge.task}</span>
                      <Badge variant={challenge.completed ? "default" : "outline"}>
                        {challenge.completed ? "✅" : `${challenge.progress}/${challenge.total}`}
                      </Badge>
                    </div>
                    {!challenge.completed && (
                      <Progress value={(challenge.progress / challenge.total) * 100} className="h-1" />
                    )}
                    <div className="text-xs text-muted-foreground">
                      🎁 +{challenge.reward} drops
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <span className="text-lg">{activity.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Game Stats & Progress */}
      <div className="space-y-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Game Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Collection Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Collection Progress</span>
                <span className="text-sm text-muted-foreground">{ownedPlants.length}/{plants.length}</span>
              </div>
              <Progress value={(ownedPlants.length / plants.length) * 100} className="h-2" />
            </div>

            {/* Daily Votes */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Vote className="h-5 w-5 text-accent" />
                <span className="font-medium">Daily Votes</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{dailyVotes}</div>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <span>Rank: #{currentRank}</span>
                <TrendingUp className="h-4 w-4 text-plant-growth" />
              </div>
            </div>

            {/* Water Drops */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Droplets className="h-5 w-5 text-water" />
                <span className="font-medium">Water Drops</span>
              </div>
              <div className="text-2xl font-bold text-water">{waterDrops}</div>
              <div className="text-sm text-muted-foreground">available</div>
            </div>

            {/* Next Goal */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                <span className="font-medium">Next Goal</span>
              </div>
              <div className="text-sm text-muted-foreground">Unlock Rainbow Rose</div>
              <Progress value={60} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlantGame;