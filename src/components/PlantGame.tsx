import { BackgroundPicker } from "@/components/customization/BackgroundPicker";
import { PlantPalette } from "@/components/customization/PlantPalette";
import { GardenCanvas } from "@/components/garden/GardenCanvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { backgroundThemes } from "@/data/backgroundThemes";
import { useGardenBackend } from "@/hooks/useGardenBackend";
import { useGardenLayout } from "@/hooks/useGardenLayout";
import { Accessory, Plant } from "@/types/garden";
import { Droplets, Edit3, Eye, Flame, ShoppingCart, Sprout, Vote } from "lucide-react";
import { useState } from "react";

interface PlantGameProps {
  userId?: string;
}

const PlantGame = ({ userId }: PlantGameProps) => {
  const [dailyVotes, setDailyVotes] = useState(47);
  const [growthStreak, setGrowthStreak] = useState(7);
  const [activeTab, setActiveTab] = useState("garden");
  
  // Backend integration
  const {
    waterDrops,
    ownedPlants: backendOwnedPlants,
    ownedAccessories: backendOwnedAccessories,
    ownedThemes: backendOwnedThemes,
    completedChallenges,
    loading: backendLoading,
    purchaseItem,
    completeChallenge: backendCompleteChallenge,
    claimChallenge: backendClaimChallenge,
    resetDailyChallenges: backendResetChallenges,
    makeGardenPublic,
    syncWaterAmount
  } = useGardenBackend();

  // Claim a daily challenge reward
  const claimChallenge = async (challengeId: string, reward: number) => {
    const success = await backendClaimChallenge(challengeId, reward);
    if (!success) {
      console.log('Challenge claim failed');
    }
  };

  // Mark challenge as completed (for demo purposes)
  const completeChallenge = async (challengeId: string) => {
    try {
      await backendCompleteChallenge(challengeId);
    } catch (error) {
      console.error('Failed to complete challenge:', error);
    }
  };

  // Reset daily challenges
  const resetDailyChallenges = async () => {
    try {
      await backendResetChallenges();
    } catch (error) {
      console.error('Failed to reset challenges:', error);
    }
  };
  
  // Garden layout management
  const {
    gardenLayout,
    editMode,
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
    toggleEditMode,
  } = useGardenLayout(userId);

  // Placement state management
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [placementMode, setPlacementMode] = useState<'plant' | 'accessory' | null>(null);
  const [targetPlant, setTargetPlant] = useState<string | null>(null);

  // Background theme management
  const [themeData, setThemeData] = useState(backgroundThemes);

  const handleThemeSelect = (themeId: string) => {
    updateBackgroundTheme(themeId);
  };

  const handleThemePurchase = async (themeId: string, cost: number) => {
    const success = await purchaseItem(themeId, cost, 'theme');
    if (success) {
      // Update theme as owned and select it
      setThemeData(prev => prev.map(theme => 
        theme.id === themeId ? { ...theme, owned: true } : theme
      ));
      updateBackgroundTheme(themeId);
    }
  };
  // Static plant data with backend ownership
  const plants: Plant[] = [
    // Basic Plants (Free)
    { id: "seedling", name: "Seedling", emoji: "🌱", cost: 0, category: 'basic', owned: backendOwnedPlants.includes("seedling") },
    { id: "grass", name: "Grass", emoji: "🌿", cost: 0, category: 'basic', owned: backendOwnedPlants.includes("grass") },
    
    // Garden Plants
    { id: "rose", name: "Rose", emoji: "🌸", cost: 35, category: 'garden', owned: backendOwnedPlants.includes("rose") },
    { id: "sunflower", name: "Sunflower", emoji: "🌻", cost: 45, category: 'garden', owned: backendOwnedPlants.includes("sunflower") },
    { id: "tulip", name: "Tulip", emoji: "🌷", cost: 30, category: 'garden', owned: backendOwnedPlants.includes("tulip") },
    { id: "tree", name: "Oak Tree", emoji: "🌳", cost: 65, category: 'garden', owned: backendOwnedPlants.includes("tree") },
    { id: "hibiscus", name: "Hibiscus", emoji: "🌺", cost: 75, category: 'garden', owned: backendOwnedPlants.includes("hibiscus") },
    
    // Exotic Plants
    { id: "cactus", name: "Cactus", emoji: "🌵", cost: 120, category: 'exotic', owned: backendOwnedPlants.includes("cactus") },
    { id: "palm", name: "Palm Tree", emoji: "🌴", cost: 150, category: 'exotic', owned: backendOwnedPlants.includes("palm") },
    { id: "cherry", name: "Cherry Blossom", emoji: "🌸", cost: 180, category: 'exotic', owned: backendOwnedPlants.includes("cherry") },
    
    // Premium Plants
    { id: "moon", name: "Moon Flower", emoji: "🌙", cost: 350, category: 'premium', owned: backendOwnedPlants.includes("moon") },
    { id: "magic", name: "Magic Plant", emoji: "✨", cost: 450, category: 'premium', owned: backendOwnedPlants.includes("magic") },
    { id: "crystal", name: "Crystal Tree", emoji: "🔮", cost: 550, category: 'premium', owned: backendOwnedPlants.includes("crystal") },
    { id: "butterfly", name: "Butterfly Bush", emoji: "🦋", cost: 400, category: 'premium', owned: backendOwnedPlants.includes("butterfly") },
    { id: "rainbow", name: "Rainbow Plant", emoji: "🌈", cost: 600, category: 'premium', owned: backendOwnedPlants.includes("rainbow") },
  ];

  // Static accessory data with backend ownership
  const accessories: Accessory[] = [
    // Hats
    { id: "crown", name: "Crown", emoji: "👑", cost: 40, category: 'hats', owned: backendOwnedAccessories.includes("crown") },
    { id: "tophat", name: "Top Hat", emoji: "🎩", cost: 35, category: 'hats', owned: backendOwnedAccessories.includes("tophat") },
    { id: "cap", name: "Cap", emoji: "🧢", cost: 20, category: 'hats', owned: backendOwnedAccessories.includes("cap") },
    { id: "beret", name: "Beret", emoji: "🎨", cost: 25, category: 'hats', owned: backendOwnedAccessories.includes("beret") },
    
    // Glasses
    { id: "sunglasses", name: "Cool Shades", emoji: "🕶️", cost: 30, category: 'glasses', owned: backendOwnedAccessories.includes("sunglasses") },
    { id: "nerdglasses", name: "Nerd Glasses", emoji: "👓", cost: 35, category: 'glasses', owned: backendOwnedAccessories.includes("nerdglasses") },
    { id: "safety", name: "Safety Goggles", emoji: "🥽", cost: 25, category: 'glasses', owned: backendOwnedAccessories.includes("safety") },
    
    // Jewelry (can have multiple)
    { id: "diamond", name: "Diamond", emoji: "💎", cost: 150, category: 'jewelry', owned: backendOwnedAccessories.includes("diamond") },
    { id: "star", name: "Star", emoji: "⭐", cost: 30, category: 'jewelry', owned: backendOwnedAccessories.includes("star") },
    { id: "sparkle", name: "Sparkle", emoji: "🌟", cost: 25, category: 'jewelry', owned: backendOwnedAccessories.includes("sparkle") },
    { id: "gem", name: "Ruby Gem", emoji: "💍", cost: 100, category: 'jewelry', owned: backendOwnedAccessories.includes("gem") },
    
    // Pots
    { id: "ceramic", name: "Ceramic Pot", emoji: "🏺", cost: 50, category: 'pots', owned: backendOwnedAccessories.includes("ceramic") },
    { id: "rainbow_pot", name: "Rainbow Pot", emoji: "🎨", cost: 120, category: 'pots', owned: backendOwnedAccessories.includes("rainbow_pot") },
    { id: "trophy", name: "Trophy Pot", emoji: "🏆", cost: 90, category: 'pots', owned: backendOwnedAccessories.includes("trophy") },
    { id: "basket", name: "Wicker Basket", emoji: "🧺", cost: 45, category: 'pots', owned: backendOwnedAccessories.includes("basket") },
    
    // Bows
    { id: "pink_bow", name: "Pink Bow", emoji: "🎀", cost: 40, category: 'bows', owned: backendOwnedAccessories.includes("pink_bow") },
    { id: "ribbon", name: "Ribbon", emoji: "🎗️", cost: 50, category: 'bows', owned: backendOwnedAccessories.includes("ribbon") },
    { id: "flower_bow", name: "Flower Bow", emoji: "🌹", cost: 70, category: 'bows', owned: backendOwnedAccessories.includes("flower_bow") },
    
    // Special Effects
    { id: "wings", name: "Butterfly Wings", emoji: "🦋", cost: 180, category: 'special', owned: backendOwnedAccessories.includes("wings") },
    { id: "lightning", name: "Lightning", emoji: "⚡", cost: 200, category: 'special', owned: backendOwnedAccessories.includes("lightning") },
    { id: "fire", name: "Fire Aura", emoji: "🔥", cost: 190, category: 'special', owned: backendOwnedAccessories.includes("fire") },
    { id: "snow", name: "Snow Effect", emoji: "❄️", cost: 160, category: 'special', owned: backendOwnedAccessories.includes("snow") },
  ];



  const buyPlant = async (plantId: string, cost: number) => {
    const success = await purchaseItem(plantId, cost, 'plant');
    if (!success) {
      console.log('Purchase failed - insufficient water drops or already owned');
    }
  };

  const buyAccessory = async (accessoryId: string, cost: number) => {
    const success = await purchaseItem(accessoryId, cost, 'accessory');
    if (!success) {
      console.log('Purchase failed - insufficient water drops or already owned');
    }
  };

  // Handle accessory placement - NEW: Independent placement
  const handleAccessoryClick = (accessoryId: string) => {
    if (!editMode) return;
    
    if (selectedAccessory === accessoryId && placementMode === 'accessory') {
      // Deselect if clicking the same accessory
      setSelectedAccessory(null);
      setPlacementMode(null);
    } else {
      // Select accessory and enter accessory placement mode
      setSelectedAccessory(accessoryId);
      setSelectedPlant(null);
      setPlacementMode('accessory');
    }
  };

  // Handle plant selection for placement
  const handlePlantClick = (plantId: string) => {
    if (!editMode) return;
    
    if (selectedPlant === plantId && placementMode === 'plant') {
      // Deselect if clicking the same plant
      setSelectedPlant(null);
      setPlacementMode(null);
    } else {
      // Select plant and enter plant placement mode
      setSelectedPlant(plantId);
      setSelectedAccessory(null);
      setPlacementMode('plant');
    }
  };

  // Handle plant click for accessory placement
  const handlePlantClickForAccessory = (plantId: string) => {
    if (!selectedAccessory || !editMode) return;

    const plant = gardenLayout.plants.find(p => p.id === plantId);
    if (!plant) return;

    const accessory = accessories.find(a => a.id === selectedAccessory);
    if (!accessory) return;

    // Handle different accessory categories
    let newAccessories = [...plant.accessories];
    
    if (accessory.category === 'hats' || accessory.category === 'glasses' || accessory.category === 'pots' || accessory.category === 'bows') {
      // Single accessory categories - replace existing
      newAccessories = newAccessories.filter(accId => {
        const existingAcc = accessories.find(a => a.id === accId);
        return existingAcc?.category !== accessory.category;
      });
      newAccessories.push(selectedAccessory);
    } else if (accessory.category === 'jewelry' || accessory.category === 'special') {
      // Multiple accessory categories - add if not already present
      if (!newAccessories.includes(selectedAccessory)) {
        newAccessories.push(selectedAccessory);
      }
    }

    // Update plant accessories
    updatePlantAccessories(plantId, newAccessories);
    
    // Clear selection
    setSelectedAccessory(null);
    setTargetPlant(null);
  };

  // Remove accessory from plant
  const removeAccessoryFromPlant = (plantId: string, accessoryId: string) => {
    const plant = gardenLayout.plants.find(p => p.id === plantId);
    if (!plant) return;

    const newAccessories = plant.accessories.filter(id => id !== accessoryId);
    updatePlantAccessories(plantId, newAccessories);
  };

  // Debug wrapper for removePlant to see if it's being called
  const handleRemovePlant = (plantId: string) => {
    //console.log('Delete button clicked for plant:', plantId);
    //console.log('Current plants:', gardenLayout.plants.map(p => p.id));
    removePlant(plantId);
    //console.log('After removal, plants:', gardenLayout.plants.filter(p => p.id !== plantId).map(p => p.id));
  };

  // Debug wrapper for removeAccessory to see if it's being called
  const handleRemoveAccessory = (accessoryId: string) => {
    //console.log('Delete button clicked for accessory:', accessoryId);
    //console.log('Current accessories:', gardenLayout.accessories.map(a => a.id));
    removeAccessory(accessoryId);
    //console.log('After removal, accessories:', gardenLayout.accessories.filter(a => a.id !== accessoryId).map(a => a.id));
  };



  return (
    <div className="space-y-6">
      {/* Garden Stats */}
      <Card className="shadow-plant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-plant-growth" />
            Garden Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 py-4">
          <div className="grid grid-cols-3 gap-6">
            {/* Water Drops */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Droplets className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-lg font-semibold text-slate-800">{waterDrops} drops</div>
            </div>

            {/* Daily Votes */}
            <div className="text-center space-y-2 border-x border-slate-200 px-4">
              <div className="flex items-center justify-center">
                <Vote className="h-5 w-5 text-slate-600" />
              </div>
              <div className="text-lg font-semibold text-slate-800">{dailyVotes} votes</div>
            </div>

            {/* Check-in Streak */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-lg font-semibold text-slate-800">{growthStreak} day streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Garden Interface */}
      <Card className="shadow-plant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-plant-growth" />
            My Garden
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-auto">
              <TabsTrigger value="garden" className="flex items-center gap-1 text-sm px-2">
                <span>🌱</span>
                <span className="hidden sm:inline">Garden</span>
              </TabsTrigger>
              <TabsTrigger value="themes" className="flex items-center gap-1 text-sm px-2">
                <span>🎨</span>
                <span className="hidden sm:inline">Themes</span>
              </TabsTrigger>
              <TabsTrigger value="shop" className="flex items-center gap-1 text-sm px-2">
                <span>🛒</span>
                <span className="hidden sm:inline">Shop</span>
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-1 text-sm px-2">
                <span>🏆</span>
                <span className="hidden sm:inline">Challenges</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-1 text-sm px-2">
                <span>👥</span>
                <span className="hidden sm:inline">Community</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="garden" className="p-0 pt-4 space-y-6">
              {/* Garden Header with Edit Button */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Your Garden Space</h3>
                <Button
                  variant={editMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleEditMode}
                  className="flex items-center gap-2"
                >
                  {editMode ? (
                    <>
                      <Eye className="h-4 w-4" />
                      View Mode
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4" />
                      Edit Garden
                    </>
                  )}
                </Button>
              </div>

              {/* Interactive Garden Canvas */}
              <GardenCanvas
                plants={gardenLayout.plants}
                gardenAccessories={gardenLayout.accessories}
                plantData={plants}
                accessories={accessories}
                isEditMode={editMode}
                backgroundTheme={gardenLayout.backgroundTheme}
                selectedAccessory={selectedAccessory}
                selectedPlant={selectedPlant}
                placementMode={placementMode}
                onPlantMove={updatePlantPosition}
                onPlantRemove={removePlant}
                onPlantConfirmPlacement={confirmPlantPlacement}
                onPlantClickForAccessory={handlePlantClickForAccessory}
                onRemoveAccessoryFromPlant={removeAccessoryFromPlant}
                onAddPlant={addPlant}
                onAccessoryMove={updateAccessoryPosition}
                onAccessoryRemove={removeAccessory}
                onAccessoryConfirmPlacement={confirmAccessoryPlacement}
                onAddAccessory={addAccessory}
              />

              {/* Edit Mode Instructions */}
              {editMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">🎨 Garden Editor</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Click plants/accessories</strong> in the palette below to select them</li>
                    <li>• <strong>Click anywhere in garden</strong> to place selected items</li>
                    <li>• <strong>Drag items</strong> to move them around freely</li>
                    <li>• <strong>Double-click items</strong> to remove them</li>
                    <li>• <strong>Switch to View Mode</strong> when done editing</li>
                  </ul>
                  {/* Show which item is currently selected */}
                  {(selectedAccessory || selectedPlant) && (
                    <div className="mt-3 p-2 bg-yellow-100 rounded border border-yellow-300">
                      <p className="text-sm text-yellow-800 font-medium">
                        ✨ {placementMode === 'accessory' 
                          ? `${accessories.find(a => a.id === selectedAccessory)?.name} selected!` 
                          : `${plants.find(p => p.id === selectedPlant)?.name} selected!`
                        } Click in the garden to place it.
                      </p>
                    </div>
                  )}
                  {/* Show instruction when nothing is selected */}
                  {!selectedAccessory && !selectedPlant && (
                    <div className="mt-3 p-2 bg-gray-100 rounded border border-gray-300">
                      <p className="text-sm text-gray-600">
                        Select a plant or accessory from the palette below to start placing items.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Plant Palette - Interactive Inventory */}
              <PlantPalette
                plants={plants}
                accessories={accessories}
                isEditMode={editMode}
                selectedAccessory={selectedAccessory}
                selectedPlant={selectedPlant}
                onPlantClick={handlePlantClick}
                onAccessoryClick={handleAccessoryClick}
              />
            </TabsContent>

            <TabsContent value="themes" className="p-0 pt-4">
              {/* Background Theme Picker */}
              <BackgroundPicker
                currentTheme={gardenLayout.backgroundTheme}
                waterDrops={waterDrops}
                themes={themeData}
                onThemeSelect={handleThemeSelect}
                onThemePurchase={handleThemePurchase}
              />
            </TabsContent>

            <TabsContent value="shop" className="p-0 pt-4 space-y-6">
              {/* Plants Shop */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Plant Shop
                </h4>
                
                {(['basic', 'garden', 'exotic', 'premium'] as const).map((category) => {
                  const categoryPlants = plants.filter(p => p.category === category && !p.owned);
                  if (categoryPlants.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h5 className="font-medium mb-3 capitalize text-muted-foreground">
                        {category} Plants
                      </h5>
                      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
                        {categoryPlants.map((plant) => (
                          <div key={plant.id} className="p-3 border rounded-lg bg-card text-center space-y-2 hover:shadow-md transition-shadow">
                            <div className="text-3xl">{plant.emoji}</div>
                            <div className="text-sm font-medium">{plant.name}</div>
                            <div className="text-sm text-water font-semibold">{plant.cost}💧</div>
                            <Button
                              size="sm"
                              variant="nature"
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

              {/* Accessories Shop */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  ✨ Accessory Shop
                </h4>
                
                {(['hats', 'glasses', 'jewelry', 'pots', 'bows', 'special'] as const).map((category) => {
                  const categoryAccessories = accessories.filter(a => a.category === category && !a.owned);
                  if (categoryAccessories.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h5 className="font-medium mb-3 capitalize text-muted-foreground">
                        {category}
                      </h5>
                      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                        {categoryAccessories.map((accessory) => (
                          <div key={accessory.id} className="p-3 border rounded-lg bg-card text-center space-y-2 hover:shadow-md transition-shadow">
                            <div className="text-2xl">{accessory.emoji}</div>
                            <div className="text-sm font-medium">{accessory.name}</div>
                            <div className="text-sm text-water font-semibold">{accessory.cost}💧</div>
                            <Button
                              size="sm"
                              variant="nature"
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
            </TabsContent>

            <TabsContent value="challenges" className="p-0 pt-4 space-y-6">
              {/* Challenges Content */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  🏆 Garden Challenges
                </h4>
                <p className="text-sm text-muted-foreground mb-6">Complete daily tasks to earn water drops and grow your garden!</p>
                
                {/* Daily Challenges */}
                <div className="space-y-3">
                  {[
                    { id: "checkin", icon: "📅", title: "Daily Check-In", description: "Visit your garden every day", reward: 5 },
                    { id: "story", icon: "📖", title: "Read Impact Stories", description: "Learn about the causes you're supporting", reward: 20 },
                    { id: "vote", icon: "🗳️", title: "Cast Your Vote", description: "Vote on community initiatives", reward: 10 },
                    { id: "social", icon: "📱", title: "Share on Social Media", description: "Spread awareness about your causes", reward: 20 }
                  ].map((challenge) => {
                    const challengeState = completedChallenges[challenge.id];
                    const canClaim = challengeState?.completed && !challengeState?.claimed;
                    const alreadyClaimed = challengeState?.claimed;
                    
                    return (
                      <div key={challenge.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                        alreadyClaimed 
                          ? 'bg-gradient-to-r from-green-100 to-green-50 border-green-300' 
                          : canClaim 
                            ? 'bg-gradient-to-r from-yellow-100 to-orange-50 border-yellow-300' 
                            : 'bg-gradient-to-r from-blue-50 to-green-50 border-green-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`text-2xl ${alreadyClaimed ? 'grayscale' : ''}`}>{challenge.icon}</div>
                          <div>
                            <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                              {challenge.title}
                              {alreadyClaimed && <span className="text-green-600">✓</span>}
                            </h5>
                            <p className="text-sm text-gray-600">{challenge.description}</p>
                            {alreadyClaimed && (
                              <p className="text-xs text-green-600 font-medium">Claimed today!</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          {alreadyClaimed ? (
                            <div className="text-lg font-bold text-green-600">Claimed ✓</div>
                          ) : canClaim ? (
                            <Button
                              onClick={() => claimChallenge(challenge.id, challenge.reward)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2"
                            >
                              Claim +{challenge.reward} 💧
                            </Button>
                          ) : (
                            <>
                              <div className="text-lg font-bold text-gray-400">+{challenge.reward} 💧</div>
                              <div className="text-xs text-gray-500">Complete to claim</div>
                              <Button
                                onClick={() => completeChallenge(challenge.id)}
                                variant="outline"
                                size="sm"
                                className="mt-1 text-xs"
                              >
                                Demo: Complete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Earning Opportunities */}
                <div className="mt-8">
                  <h4 className="text-md font-semibold mb-4 flex items-center gap-2">
                    💧 Earning Opportunities
                  </h4>
                  <div className="space-y-3">
                    {[
                      { icon: "💝", title: "Make a Donation", description: "Every $1 donated supports causes", reward: "1 drop per $1", frequency: "Anytime" },
                      { icon: "🤝", title: "Referral Program", description: "Invite friends to donate using your code", reward: 30, frequency: "Per new donor" }
                    ].map((opportunity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{opportunity.icon}</div>
                          <div>
                            <h5 className="font-semibold text-gray-800">{opportunity.title}</h5>
                            <p className="text-sm text-gray-600">{opportunity.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-water">
                            {typeof opportunity.reward === 'number' ? `+${opportunity.reward} 💧` : opportunity.reward}
                          </div>
                          <div className="text-xs text-gray-500">{opportunity.frequency}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Progress & Reset */}
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-300">
                    <h5 className="font-semibold text-green-800 mb-2">🌟 Daily Progress</h5>
                    <p className="text-sm text-green-700 mb-2">
                      Complete all daily challenges to earn up to <span className="font-bold">55 water drops</span> per day!
                    </p>
                    <div className="text-sm text-green-600">
                      Today's Progress: {Object.values(completedChallenges).filter(c => c.claimed).length}/4 challenges claimed
                    </div>
                  </div>
                  
                  {/* Demo Reset Button */}
                  <div className="text-center">
                    <Button
                      onClick={resetDailyChallenges}
                      variant="outline" 
                      size="sm"
                      className="text-sm"
                    >
                      🔄 Demo: Reset Daily Challenges
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="community" className="p-0 pt-4 space-y-6">
              {/* Community Garden Gallery */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  👥 Community Gardens
                </h4>
                <p className="text-sm text-muted-foreground mb-6">Explore beautiful gardens created by other gardeners!</p>
                
                {/* Featured Gardens */}
                <div>
                  <h5 className="font-medium mb-3 text-green-700">🌟 Featured Gardens</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { 
                        id: "garden1", 
                        name: "Tropical Paradise", 
                        creator: "GardenMaster", 
                        plants: 12, 
                        theme: "Ocean Breeze",
                        likes: 45,
                        preview: "🌴🌺🦋"
                      },
                      { 
                        id: "garden2", 
                        name: "Enchanted Forest", 
                        creator: "NatureLover", 
                        plants: 18, 
                        theme: "Aurora Borealis",
                        likes: 67,
                        preview: "🌲✨🌙"
                      }
                    ].map((garden) => (
                      <div key={garden.id} className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h6 className="font-semibold text-gray-800">{garden.name}</h6>
                            <p className="text-sm text-gray-600">by {garden.creator}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-red-500">❤️ {garden.likes}</div>
                          </div>
                        </div>
                        
                        <div className="text-center py-8 text-4xl bg-white/50 rounded border-2 border-dashed border-green-300 mb-3">
                          {garden.preview}
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                          <span>{garden.plants} plants</span>
                          <span>Theme: {garden.theme}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            👁️ View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            ❤️ Like
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            📋 Copy
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Friends' Gardens */}
                <div>
                  <h5 className="font-medium mb-3 text-blue-700">👨‍👩‍👧‍👦 Friends' Gardens</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { id: "friend1", name: "Sarah's Zen Garden", creator: "SarahG", plants: 8, preview: "🌸🧘‍♀️🌿" },
                      { id: "friend2", name: "Mike's Veggie Patch", creator: "MikeTheGardener", plants: 15, preview: "🥕🍅🌽" },
                      { id: "friend3", name: "Luna's Moonlight Garden", creator: "LunaFlower", plants: 11, preview: "🌙⭐🌺" }
                    ].map((friend) => (
                      <div key={friend.id} className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
                        <div className="text-center py-4 text-2xl bg-white/50 rounded border border-purple-200 mb-2">
                          {friend.preview}
                        </div>
                        <h6 className="font-medium text-gray-800 text-sm">{friend.name}</h6>
                        <p className="text-xs text-gray-600 mb-2">by {friend.creator}</p>
                        <p className="text-xs text-gray-500 mb-2">{friend.plants} plants</p>
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          Visit Garden
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Your Garden Sharing */}
                <div className="p-4 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg border border-blue-300">
                  <h5 className="font-semibold text-blue-800 mb-2">📤 Share Your Garden</h5>
                  <p className="text-sm text-blue-700 mb-3">
                    Let others discover your beautiful garden! Your garden will appear in the community gallery.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      🌍 Make Public
                    </Button>
                    <Button size="sm" variant="outline">
                      📝 Add Description
                    </Button>
                    <Button size="sm" variant="outline">
                      🔗 Get Share Link
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantGame;