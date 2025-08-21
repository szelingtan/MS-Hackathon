import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Sprout, Users, MapPin, Droplets, LogOut, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PlantGame from "@/components/PlantGame";
import RegionSelector from "@/components/RegionSelector";
import ImpactFeed from "@/components/ImpactFeed";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [userPoints, setUserPoints] = useState(250);
  const [showDonationFlow, setShowDonationFlow] = useState(false);

  const handleLogout = () => {
    logout();
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
            <div className="flex items-center space-x-2 bg-gradient-water px-3 py-1 rounded-full">
              <Droplets className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">{userPoints} drops</span>
            </div>
            <Badge variant="secondary">
              Welcome {user?.name}!
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="game" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="game" className="flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              My Garden
            </TabsTrigger>
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Impact Stories
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
                      onClick={() => setShowDonationFlow(true)}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Make Donation
                    </Button>
                    <Button variant="earth" className="w-full">
                      <Trophy className="h-4 w-4 mr-2" />
                      View Leaderboard
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Donation Flow */}
              <div className="lg:col-span-2 space-y-6">
                {showDonationFlow && (
                  <Card className="shadow-soft">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-accent" />
                        Choose Your Impact Region
                      </CardTitle>
                      <CardDescription>
                        Select a community or school to support
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RegionSelector 
                        selectedRegion={selectedRegion}
                        onSelectRegion={setSelectedRegion}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Stats Cards */}
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
          </TabsContent>

          <TabsContent value="feed" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Impact Stories
                </CardTitle>
                <CardDescription>
                  See the real difference your donations make
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImpactFeed />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;