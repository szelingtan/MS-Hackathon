import ProfileBadges from "@/components/profile/ProfileBadges";
import ProfileCommendations from "@/components/profile/ProfileCommendations";
import ProfileProgress from "@/components/profile/ProfileProgress";
import ProfileProjects from "@/components/profile/ProfileProjects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Heart, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Hong Kong districts mapping
const districtMap = {
  1: "Hong Kong Island",
  2: "Kowloon",
  3: "New Territories",
  4: "Outlying Islands"
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email || "");
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [districtId, setDistrictId] = useState(user?.district_id || 1);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setDisplayName(user.name);
      setDistrictId(user.district_id);
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        email,
        name: displayName,
        district_id: districtId,
      });
      
      toast.success("Profile updated successfully! 🌱");
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Please log in to view your profile.</p>
          <Button onClick={() => console.log('Navigate to login')} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sky py-10">
      <div className="container mx-auto max-w-4xl space-y-6">

        {/* Back Button */}
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          ← Back
        </Button>

        {/* Profile Header */}
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-plant-growth to-plant-base rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {displayName.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">{displayName}</h1>
                <p className="text-muted-foreground">{districtMap[districtId as keyof typeof districtMap]}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl">💧</span>
                    <span className="font-semibold text-plant-growth">{user.water_amount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl">💝</span>
                    <span className="font-semibold text-accent">${user.donated_amount}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Summary */}
      <Card className="shadow-soft bg-gradient-to-r from-green-100 to-blue-100">
        <CardHeader>
          <CardTitle className="text-green-800">Your Impact Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">65</div>
              <p className="text-sm text-green-600">Students Helped</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">2</div>
              <p className="text-sm text-blue-600">Schools Supported</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">8</div>
              <p className="text-sm text-purple-600">People Inspired</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">$200</div>
              <p className="text-sm text-orange-600">Additional Funds Raised</p>
            </div>
          </div>
        </CardContent>
      </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-soft border border-green-100 p-2">
            <TabsList className="w-full h-auto grid grid-cols-2 md:grid-cols-5 gap-2 bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-plant-growth data-[state=active]:to-plant-base data-[state=active]:text-white px-4 py-3 text-sm font-medium rounded-md transition-all hover:bg-green-50 data-[state=active]:hover:from-plant-growth data-[state=active]:hover:to-plant-base text-green-700 data-[state=active]:text-white"
              >
                📊 Overview
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-plant-growth data-[state=active]:to-plant-base data-[state=active]:text-white px-4 py-3 text-sm font-medium rounded-md transition-all hover:bg-green-50 data-[state=active]:hover:from-plant-growth data-[state=active]:hover:to-plant-base text-green-700 data-[state=active]:text-white"
              >
                📈 My Progress
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-plant-growth data-[state=active]:to-plant-base data-[state=active]:text-white px-4 py-3 text-sm font-medium rounded-md transition-all hover:bg-green-50 data-[state=active]:hover:from-plant-growth data-[state=active]:hover:to-plant-base text-green-700 data-[state=active]:text-white"
              >
                🚀 My Projects
              </TabsTrigger>
              <TabsTrigger 
                value="badges" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-plant-growth data-[state=active]:to-plant-base data-[state=active]:text-white px-4 py-3 text-sm font-medium rounded-md transition-all hover:bg-green-50 data-[state=active]:hover:from-plant-growth data-[state=active]:hover:to-plant-base text-green-700 data-[state=active]:text-white"
              >
                🏆 Badges
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-plant-growth data-[state=active]:to-plant-base data-[state=active]:text-white px-4 py-3 text-sm font-medium rounded-md transition-all hover:bg-green-50 data-[state=active]:hover:from-plant-growth data-[state=active]:hover:to-plant-base text-green-700 data-[state=active]:text-white col-span-2 md:col-span-1"
              >
                ⚙️ Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Profile Stats Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-plant-growth">{user.water_amount}</p>
                    <p className="text-sm text-muted-foreground">Water Drops</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-accent">${user.donated_amount}</p>
                    <p className="text-sm text-muted-foreground">Total Donated</p>
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-lg font-medium">{districtMap[user.district_id as keyof typeof districtMap]}</p>
                  <p className="text-sm text-muted-foreground">Your District</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-accent" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-plant-base/10 to-plant-growth/10 rounded-lg border border-plant-base/20">
                    <div className="p-2 rounded-full bg-plant-growth/20">
                      <Heart className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium">100 Lives Touched</p>
                      <p className="text-sm text-muted-foreground">Impacted 100+ students</p>
                    </div>
                    <Badge className="ml-auto bg-plant-growth/20 text-plant-growth border-plant-growth/30">
                      Latest!
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Latest Commendation Preview */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-destructive" />
                  Latest Commendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg border border-pink-200">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🏫</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">Sunnydale Elementary</h4>
                      <p className="text-sm text-muted-foreground italic">"Your generous donation helped us build our new computer lab. The children are thriving!"</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          25 students gained computer access
                        </Badge>
                        <span className="text-xs text-muted-foreground">2024-01-15</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <ProfileProgress user={user} />
          </TabsContent>

          {/* My Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <ProfileProjects />
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <ProfileBadges user={user} />
            <ProfileCommendations />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Basic Info Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
              </CardContent>
            </Card>

            {/* District Selection Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Home District</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="district">Your Home District</Label>
                  <select
                    id="district"
                    value={districtId}
                    onChange={(e) => setDistrictId(Number(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 bg-background"
                  >
                    {Object.entries(districtMap).map(([id, name]) => (
                      <option key={id} value={Number(id)}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-muted-foreground mt-2">
                    This helps us show you relevant projects in your area.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Plant Inventory Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Your Garden</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Plants Collected</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.inventory?.plants && user.inventory.plants.length > 0 ? (
                      user.inventory.plants.map((plant, index) => (
                        <Badge key={index} variant="outline" className="capitalize">
                          🌱 {plant.replace("_", " ")}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No plants collected yet</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>Accessories Collected</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.inventory?.accessories && user.inventory.accessories.length > 0 ? (
                      user.inventory.accessories.map((accessory, index) => (
                        <Badge key={index} variant="outline" className="capitalize">
                          ✨ {accessory.replace("_", " ")}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No accessories collected yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex items-center justify-center">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="w-full max-w-xs"
                variant="nature"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;