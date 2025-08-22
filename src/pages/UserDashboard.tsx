import ImpactFeed from "@/components/ImpactFeed";
import Leaderboard from "@/components/Leaderboard";
import PlantGame from "@/components/PlantGame";
import HongKongMap from "@/components/HongKongMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Droplets, Heart, LogOut, MapPin, Sprout, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const { user, logout, updateWaterAmount, updateDonatedAmount } = useAuth();
  const [activeTab, setActiveTab] = useState("game");
  const [donationAmount, setDonationAmount] = useState(10);
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<DonationProject | null>(null);
  
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleProjectDonate = (project: DonationProject) => {
    setCurrentProject(project);
    setDonationAmount(10);
    setIsDonationDialogOpen(true);
  };

  const handleDonation = async () => {
    if (donationAmount <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    try {
      // Update donated amount and give water drops (5 drops per dollar)
      const waterDropsEarned = Math.floor(donationAmount * 5);
      
      await updateDonatedAmount(donationAmount);
      await updateWaterAmount(waterDropsEarned);
      
      // Close dialog and show success message
      setIsDonationDialogOpen(false);
      toast.success(`Thank you for donating $${donationAmount}${currentProject ? ' to ' + currentProject.title : ''}! You received ${waterDropsEarned} water drops! 💧`);
      
      // Reset for next time
      setDonationAmount(10);
      setCurrentProject(null);
    } catch (error) {
      console.error("Error processing donation:", error);
      toast.error("There was an error processing your donation. Please try again.");
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-plant-growth animate-leaf-sway" />
            <h1 className="text-2xl font-bold text-primary">Reach Together</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                {user.water_amount} drops
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                ${user.donated_amount} donated
              </Badge>
            </div>
            <Badge variant="secondary">
              Welcome {user.name}!
            </Badge>
            <Button variant="outline" size="sm" onClick={goToProfile}>
              Profile
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="game" className="flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              My Garden
            </TabsTrigger>
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Projects Map
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-6">
            <PlantGame waterDrops={user.water_amount} />
          </TabsContent>

          <TabsContent value="feed" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  Hong Kong Districts
                </CardTitle>
                <CardDescription>
                  Explore the districts where your donations make an impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[600px]">
                  <HongKongMap height={600} onDonate={handleProjectDonate} />
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
            <Button variant="nature" onClick={handleDonation}>
              <Heart className="h-4 w-4 mr-2" />
              Donate ${donationAmount}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;