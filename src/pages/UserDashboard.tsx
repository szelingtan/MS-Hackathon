import ImpactFeed from "@/components/ImpactFeed";
import Leaderboard from "@/components/Leaderboard";
import PlantGame from "@/components/PlantGame";
import RegionSelector from "@/components/RegionSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Droplets, Heart, LogOut, MapPin, Sprout, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [userPoints, setUserPoints] = useState(250);
  const [showDonationFlow, setShowDonationFlow] = useState(false);
  const [activeTab, setActiveTab] = useState("game");
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/profile');
  };

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
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="game" className="flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              My Garden
            </TabsTrigger>
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Impact Stories
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="donate" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Donate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-6">
            <PlantGame waterDrops={userPoints} />
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

          <TabsContent value="leaderboard" className="space-y-6">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="donate" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;