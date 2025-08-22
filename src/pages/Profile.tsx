import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const availableLocations = ["Hong Kong", "Macau", "Shenzhen"];
const availableDistricts = ["Kowloon", "New Territories", "Hong Kong Island"];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email || "");
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [location, setLocation] = useState(user?.location || "");
  const [districts, setDistricts] = useState<string[]>(user?.districts || []);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setEmail(user?.email || "");
    setDisplayName(user?.name || "");
    setLocation(user?.location || "");
    setDistricts(user?.districts || []);
  }, [user]);

  const toggleDistrict = (district: string) => {
    setDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser({
        email,
        name: displayName,
        location,
        districts,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky py-10">
      <div className="container mx-auto max-w-lg space-y-6">

        {/* Back Button */}
        <Button variant="outline" onClick={() => navigate(-1)}>
          ← Back
        </Button>

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

        {/* Location & Districts Card */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Location & Supported Districts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select location</option>
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Supported Districts</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {availableDistricts.map((district) => (
                  <label key={district} className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={districts.includes(district)}
                      onChange={() => toggleDistrict(district)}
                      className="rounded border-gray-300 text-plant-growth focus:ring-plant-growth"
                    />
                    <span>{district}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button & Success Badge */}
        <div className="flex items-center space-x-4">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          {saveSuccess && (
            <Badge variant="success" className="py-2">
              Profile saved!
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
