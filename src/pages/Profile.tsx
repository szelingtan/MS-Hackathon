import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <Button onClick={() => navigate('/login')} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sky py-10">
      <div className="container mx-auto max-w-lg space-y-6">

        {/* Back Button */}
        <Button variant="outline" onClick={() => navigate(-1)}>
          ← Back
        </Button>

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
                {user.inventory.plants.map((plant, index) => (
                  <Badge key={index} variant="outline" className="capitalize">
                    🌱 {plant.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Accessories Collected</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.inventory.accessories.length > 0 ? (
                  user.inventory.accessories.map((accessory, index) => (
                    <Badge key={index} variant="outline" className="capitalize">
                      ✨ {accessory.replace('_', ' ')}
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
      </div>
    </div>
  );
};

export default Profile;
