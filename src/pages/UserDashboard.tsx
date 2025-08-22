import ImpactFeed from "@/components/ImpactFeed";
import Leaderboard from "@/components/Leaderboard";
import PlantGame from "@/components/PlantGame";
import RegionSelector from "@/components/RegionSelector";
import HongKongMap from "@/components/HongKongMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress"; // Add this import
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Droplets, Heart, LogOut, MapPin, Sprout, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


// Add this interface for the project data
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
  const { user, logout } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [userPoints, setUserPoints] = useState(250);
  const [showDonationFlow, setShowDonationFlow] = useState(false);
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
  };
  
  // Handler for project-specific donations
  const handleProjectDonate = (project: DonationProject) => {
    setCurrentProject(project);
    setSelectedRegion(project.district);
    setDonationAmount(10); // Default amount or you can set a different default
    setIsDonationDialogOpen(true);
  };

  const handleDonation = async () => {
    if (donationAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call to update the database
      // In a real app, this would be a fetch call to your backend
      const updatedPoints = userPoints + Math.floor(donationAmount * 5); // Convert dollars to points
      setUserPoints(updatedPoints);

      // Mock updating a donation database
      const newDonation = {
        id: Date.now(),
        amount: donationAmount,
        userId: user?.id || "anonymous",
        date: new Date().toISOString(),
        district: selectedRegion || "General Fund",
        projectId: currentProject?.id || null,
        projectTitle: currentProject?.title || null
      };

      console.log("Donation added:", newDonation);
      
      // Close dialog and show success message
      setIsDonationDialogOpen(false);
      toast({
        title: "Donation successful!",
        description: `Thank you for donating $${donationAmount}${currentProject ? ' to ' + currentProject.title : ''}. You received ${Math.floor(donationAmount * 5)} drops!`,
      });
      
      // Reset donation amount and project for next time
      setDonationAmount(10);
      setCurrentProject(null);
    } catch (error) {
      console.error("Error processing donation:", error);
      toast({
        title: "Donation failed",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
    }
  };

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
            <Badge variant="secondary">
              Welcome {user?.name}!
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button variant="outline" size="sm" onClick={goToProfile}>
              Profile
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
              <Users className="h-4 w-4" />
              Forestry
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Plant Game */}
              <div className="lg:col-span-1">
                <Card className="shadow-plant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sprout className="h-5 w-5 text-plant-growth" />
                      Your Garden
                    </CardTitle>
                    <CardDescription>
                      Grow your plant with every donation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PlantGame waterDrops={userPoints} />
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="mt-6 shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="nature"
                      className="w-full"
                      onClick={() => setIsDonationDialogOpen(true)}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Make Donation
                    </Button>
                    <Button
                      variant="earth"
                      className="w-full"
                      onClick={() => setActiveTab("leaderboard")}
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      View Leaderboard
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Cards */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="text-center shadow-soft">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-plant-growth">127</div>
                      <p className="text-sm text-muted-foreground">Your Donations</p>
                    </CardContent>
                  </Card>

                  <Card className="text-center shadow-soft">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-accent">15</div>
                      <p className="text-sm text-muted-foreground">Schools Helped</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            <PlantGame waterDrops={userPoints} />
          </TabsContent>

          <TabsContent value="feed" className="space-y-6">
            {/* Hong Kong Map with onDonate prop */}
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

      {/* Donation Dialog with project information */}
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Project</Label>
                <div className="col-span-3 text-sm">{currentProject.title}</div>
              </div>
            )}
            {(selectedRegion || currentProject?.district) && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Region</Label>
                <div className="col-span-3">{currentProject?.district || selectedRegion || "General Fund"}</div>
              </div>
            )}
            {currentProject && (
              <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                <p className="font-medium mb-1">Project Goal: ${currentProject.goal}</p>
                <p className="text-muted-foreground mb-2">
                  ${currentProject.raised} raised so far by {currentProject.supporters} supporters
                </p>
                <Progress value={(currentProject.raised / currentProject.goal) * 100} className="h-2 mb-2" />
              </div>
            )}
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