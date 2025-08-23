import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Droplets, Heart, LogOut, MapPin, Sprout, Trophy, Users } from "lucide-react";
import ImpactFeed from "@/components/ImpactFeed";
import Leaderboard from "@/components/Leaderboard";
import PlantGame from "@/components/PlantGame";
import HongKongMap from "@/components/HongKongMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useGardenBackend } from "@/hooks/useGardenBackend";
import treeLogo from "@/assets/tree.png";
import reachTogetherLogo from "@/assets/reachTogether.png";

interface DonationProject {
  id: number;
  district: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  supporters: number;
  urgency: 'low' | 'medium' | 'high';
  category: string;
  image: string;
}

const UserDashboard = () => {
  const { user, logout, processDonation, updateCounter, refreshUserData } = useAuth();
  const { addWaterDrops, syncWaterAmount } = useGardenBackend();
  const [activeTab, setActiveTab] = useState("game");
  const [donationAmount, setDonationAmount] = useState(10);
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<DonationProject | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Force re-render when user water amount changes
  const [renderKey, setRenderKey] = useState(0);
  // Local copy of user water amount to ensure updates
  const [localWaterAmount, setLocalWaterAmount] = useState(user?.water_amount || 0);
  
  const navigate = useNavigate();

  // Update local water amount when user changes
  useEffect(() => {
    if (user?.water_amount !== undefined) {
      console.log('User water_amount changed in effect:', user.water_amount);
      setLocalWaterAmount(user.water_amount);
      setRenderKey(prev => prev + 1); // Force re-render when water amount changes
    }
  }, [user?.water_amount]);

  // Listen for custom water drop update events
  useEffect(() => {
    const handleWaterDropUpdate = (event: CustomEvent) => {
      console.log('Received waterDropsUpdated event:', event.detail);
      const newAmount = event.detail.newTotal || user?.water_amount || 0;
      console.log('Setting local water amount to:', newAmount);
      setLocalWaterAmount(newAmount);
      setRenderKey(prev => prev + 1);
    };

    window.addEventListener('waterDropsUpdated', handleWaterDropUpdate);
    
    return () => {
      window.removeEventListener('waterDropsUpdated', handleWaterDropUpdate);
    };
  }, [user?.water_amount]);

  // Debug: Log when user water amount changes and force re-render
  useEffect(() => {
    if (user) {
      console.log('User water amount updated:', user.water_amount);
      console.log('User donated amount updated:', user.donated_amount);
      console.log('User last updated timestamp:', user._lastUpdated);
      console.log('Update counter:', updateCounter);
      // Force component re-render by incrementing counter
      setRenderKey(prev => prev + 1);
    }
  }, [user, updateCounter]);

  const goToProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleProjectDonate = (project: DonationProject) => {
    // Set the current project and open the donation dialog
    setCurrentProject(project);
    setIsDonationDialogOpen(true);
  };

  const handleDonationUpdate = () => {
    // Called after donation is processed to refresh data
    // This could be used to refetch user stats or project data
  };

  const handleDonation = async () => {
    if (donationAmount <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    if (!user) {
      toast.error("Please log in to make a donation");
      return;
    }

    setIsProcessing(true);

    try {
      let result;
      
      if (currentProject) {
        // Project-specific donation - call Firebase processDonation with project details
        result = await processDonation(
          donationAmount, 
          currentProject.id, // Use project ID as target district ID
          currentProject.id, // Also pass as project ID
          currentProject.title // Pass project title
        );
        
        // Update localStorage for the map component to track user's donations
        const loadMyDonations = () => {
          try {
            const raw = localStorage.getItem('hk_game_my_donations');
            return raw ? (JSON.parse(raw) as Record<number, number>) : {};
          } catch { return {}; }
        };
        
        const saveMyDonations = (obj: Record<number, number>) => {
          try { 
            localStorage.setItem('hk_game_my_donations', JSON.stringify(obj)); 
          } catch (error) {
            console.error('Failed to save donations to localStorage:', error);
          }
        };
        
        // Update localStorage with user's donation to this project
        const currentDonations = loadMyDonations();
        const updatedDonations = {
          ...currentDonations,
          [currentProject.id]: (currentDonations[currentProject.id] || 0) + donationAmount
        };
        saveMyDonations(updatedDonations);
        
        console.log('Updated user donations:', updatedDonations); // Debug log
        
        // Notify the map component about the donation
        const hongKongMapElement = document.querySelector('[data-hongkong-map]');
        if (hongKongMapElement) {
          hongKongMapElement.dispatchEvent(new CustomEvent('donation-made', {
            detail: {
              projectId: currentProject.id,
              amount: donationAmount
            }
          }));
          console.log('Dispatched donation event for project:', currentProject.id, 'amount:', donationAmount); // Debug log
        }
        
        toast.success(`Thank you for donating $${donationAmount} to ${currentProject.title}! You received ${result.waterDropsEarned} water drops! 💧`);
      } else {
        // General donation without specific project
        result = await processDonation(donationAmount, 1);
        toast.success(`Thank you for donating $${donationAmount}! You received ${result.waterDropsEarned} water drops! 💧`);
      }
      
      // Immediately update the local water amount with the new total from the result
      const newWaterTotal = result.newWaterAmount;
      console.log('Immediately updating local water amount to:', newWaterTotal);
      setLocalWaterAmount(newWaterTotal);
      setRenderKey(prev => prev + 1);
      
      // Sync garden backend with the updated water amount from donors collection
      const waterDropsEarned = Math.floor(donationAmount * 5);
      
      // Then refresh and sync everything else
      const refreshedUser = await refreshUserData();
      await syncWaterAmount();
      
      // Update local water amount state with the refreshed amount or result amount
      const finalWaterAmount = refreshedUser?.water_amount || newWaterTotal || (user.water_amount || 0);
      console.log('Final water amount being set:', finalWaterAmount);
      setLocalWaterAmount(finalWaterAmount);
      
      // Force render key update
      setRenderKey(prev => prev + 1);
      
      // Dispatch custom event to ensure UI updates
      window.dispatchEvent(new CustomEvent('waterDropsUpdated', {
        detail: {
          newTotal: finalWaterAmount,
          amountAdded: waterDropsEarned
        }
      }));
      
      // Close dialog and reset form
      setIsDonationDialogOpen(false);
      setDonationAmount(10);
      setCurrentProject(null);

      // Add a small delay to ensure Firebase has processed everything
      setTimeout(async () => {
        try {
          // Additional refresh to ensure navbar is updated
          const finalRefresh = await refreshUserData();
          if (finalRefresh) {
            setLocalWaterAmount(finalRefresh.water_amount || 0);
            setRenderKey(prev => prev + 1);
          }
        } catch (error) {
          console.error('Error in final refresh:', error);
        }
      }, 1000);

      // Trigger any update callbacks
      handleDonationUpdate();
    } catch (error) {
      console.error("Error processing donation:", error);
      toast.error("There was an error processing your donation. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Please log in to access your dashboard.</p>
          <Button onClick={() => navigate('/login')} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <img src={treeLogo} alt="Logo" className="h-8 w-auto" />
              <img src={reachTogetherLogo} alt="Reach Together" className="h-6 w-auto mt-1" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Badge 
                  key={`water-${renderKey}-${localWaterAmount}`}
                  variant="secondary" 
                  className="flex items-center gap-1 text-xs"
                >
                  <Droplets className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">{localWaterAmount} drops</span>
                  <span className="xs:hidden">{localWaterAmount}</span>
                </Badge>
                <Badge 
                  key={`donated-${renderKey}-${user.donated_amount}`}
                  variant="outline" 
                  className="flex items-center gap-1 text-xs"
                >
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">${user.donated_amount} donated</span>
                  <span className="xs:hidden">${user.donated_amount}</span>
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Welcome {user.name}!
                </Badge>
                <Button variant="outline" size="sm" onClick={goToProfile} className="text-xs px-2">
                  Profile
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs px-2">
                  <LogOut className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto h-auto p-1">
            <TabsTrigger value="game" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 text-xs sm:text-sm">
              <Sprout className="h-4 w-4" />
              <span className="hidden sm:inline">My Garden</span>
              <span className="sm:hidden">Garden</span>
            </TabsTrigger>
            <TabsTrigger value="feed" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 text-xs sm:text-sm">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Projects Map</span>
              <span className="sm:hidden">Map</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 text-xs sm:text-sm">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Leaderboard</span>
              <span className="sm:hidden">Leaders</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-6">
            <PlantGame userId={user.user_id} />
          </TabsContent>

          <TabsContent value="feed" className="space-y-4 sm:space-y-6">
            <Card className="shadow-soft">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  Hong Kong Districts
                </CardTitle>
                <CardDescription className="text-sm">
                  Explore the districts where your donations make an impact
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <div className="w-full rounded-lg">
                  <HongKongMap 
                    height={window.innerWidth < 640 ? 300 : 600}
                    onDonationUpdate={handleDonationUpdate} 
                    onProjectDonate={handleProjectDonate}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Leaderboard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Donation Dialog */}
      <Dialog open={isDonationDialogOpen} onOpenChange={setIsDonationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Make a Donation
            </DialogTitle>
            <DialogDescription>
              {currentProject 
                ? `Support the project "${currentProject.title}" in ${currentProject.district}.` 
                : "Your donation helps support schools and communities in Hong Kong."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount $
              </Label>
              <Input
                id="amount"
                type="number"
                min="1"
                className="col-span-3"
                value={donationAmount}
                onChange={(e) => setDonationAmount(Number(e.target.value))}
              />
            </div>
            {currentProject && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Project</Label>
                  <div className="col-span-3 text-sm">{currentProject.title}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Region</Label>
                  <div className="col-span-3">{currentProject.district}</div>
                </div>
                <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                  <p className="font-medium mb-1">Project Goal: ${currentProject.goal}</p>
                  <p className="text-muted-foreground mb-2">
                    ${currentProject.raised} raised so far by {currentProject.supporters} supporters
                  </p>
                  <Progress value={(currentProject.raised / currentProject.goal) * 100} className="h-2 mb-2" />
                </div>
              </>
            )}
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              💧 You'll earn {Math.floor(donationAmount * 5)} water drops for this donation!
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDonationDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="nature" 
              onClick={handleDonation} 
              disabled={isProcessing}
            >
              <Heart className="h-4 w-4 mr-2" />
              {isProcessing ? "Processing..." : `Donate $${donationAmount}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;