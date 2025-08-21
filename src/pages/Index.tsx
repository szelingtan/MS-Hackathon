import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sprout, Trophy, Users, MapPin, Droplets } from "lucide-react";
import heroImage from "@/assets/hero-plant-hands.jpg";
import PlantGame from "@/components/PlantGame";
import RegionSelector from "@/components/RegionSelector";
import ImpactFeed from "@/components/ImpactFeed";

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [userPoints, setUserPoints] = useState(250);
  const [showDonationFlow, setShowDonationFlow] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-plant-growth animate-leaf-sway" />
            <h1 className="text-2xl font-bold text-primary">Earth Kindness</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-water px-3 py-1 rounded-full">
              <Droplets className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">{userPoints} drops</span>
            </div>
            <Button variant="earth" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Donate
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-plant-base/20 text-plant-base border-plant-base/30">
              🌱 Growing Communities Together
            </Badge>
            
            <h2 className="text-5xl font-bold text-foreground leading-tight">
              Plant Seeds of
              <span className="bg-gradient-growth bg-clip-text text-transparent"> Change</span>
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Support schools and communities while growing your virtual plant. 
              Every donation nurtures real impact and grows your digital garden.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="nature" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => setShowDonationFlow(true)}
              >
                <Sprout className="h-5 w-5 mr-2" />
                Start Growing Impact
              </Button>
              
              <Button variant="earth" size="lg" className="text-lg px-8 py-6">
                <Trophy className="h-5 w-5 mr-2" />
                View Leaderboard
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-growth rounded-3xl blur-3xl opacity-20 animate-float"></div>
            <img 
              src={heroImage} 
              alt="Hands nurturing a growing plant representing community support"
              className="relative rounded-3xl shadow-growth w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="text-center shadow-soft">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-plant-growth">1,247</div>
              <p className="text-muted-foreground">Trees Planted</p>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-soft">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-accent">89</div>
              <p className="text-muted-foreground">Schools Supported</p>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-soft">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-water">5,678</div>
              <p className="text-muted-foreground">Active Donors</p>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-soft">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-earth">$127K</div>
              <p className="text-muted-foreground">Total Raised</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-4 py-12">
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
          </div>

          {/* Region Selection & Impact Feed */}
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;