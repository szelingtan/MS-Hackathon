import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Target, CheckCircle } from "lucide-react";

interface Region {
  id: string;
  name: string;
  type: "school" | "community" | "district";
  population: number;
  funded: number;
  goal: number;
  description: string;
  urgency: "high" | "medium" | "low";
}

interface RegionSelectorProps {
  selectedRegion: string;
  onSelectRegion: (regionId: string) => void;
}

const RegionSelector = ({ selectedRegion, onSelectRegion }: RegionSelectorProps) => {
  const [donationAmount, setDonationAmount] = useState(25);

  const regions: Region[] = [
    {
      id: "district-1",
      name: "Sunnydale Elementary",
      type: "school",
      population: 340,
      funded: 2800,
      goal: 5000,
      description: "Building a new library and computer lab for students",
      urgency: "high"
    },
    {
      id: "district-2", 
      name: "Riverside Community Center",
      type: "community",
      population: 1200,
      funded: 7200,
      goal: 12000,
      description: "Expanding after-school programs and nutrition support",
      urgency: "medium"
    },
    {
      id: "district-3",
      name: "Green Valley District",
      type: "district",
      population: 2500,
      funded: 15000,
      goal: 25000,
      description: "Environmental education and sustainability projects",
      urgency: "low"
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-destructive/20 text-destructive border-destructive/30";
      case "medium": return "bg-accent/20 text-accent border-accent/30";
      case "low": return "bg-plant-base/20 text-plant-base border-plant-base/30";
      default: return "bg-muted";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "school": return "🏫";
      case "community": return "🏘️";
      case "district": return "🌍";
      default: return "📍";
    }
  };

  const handleDonate = (regionId: string) => {
    onSelectRegion(regionId);
    // Here you would typically handle the donation process
    console.log(`Donating $${donationAmount} to ${regionId}`);
  };

  return (
    <div className="space-y-6">
      {/* Donation Amount Selector */}
      <div className="flex items-center justify-center space-x-2 p-4 bg-secondary/50 rounded-lg">
        <span className="text-sm font-medium text-muted-foreground">Donation Amount:</span>
        <div className="flex space-x-2">
          {[10, 25, 50, 100].map((amount) => (
            <Button
              key={amount}
              variant={donationAmount === amount ? "nature" : "outline"}
              size="sm"
              onClick={() => setDonationAmount(amount)}
            >
              ${amount}
            </Button>
          ))}
        </div>
      </div>

      {/* Regions Grid */}
      <div className="grid gap-4">
        {regions.map((region) => {
          const progress = (region.funded / region.goal) * 100;
          const isSelected = selectedRegion === region.id;
          
          return (
            <Card 
              key={region.id} 
              className={`
                cursor-pointer transition-all duration-300 hover:shadow-soft
                ${isSelected ? 'ring-2 ring-primary shadow-plant' : ''}
              `}
              onClick={() => onSelectRegion(region.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getTypeIcon(region.type)}</div>
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        {region.name}
                        {isSelected && <CheckCircle className="h-4 w-4 text-plant-growth" />}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getUrgencyColor(region.urgency)}>
                          {region.urgency} priority
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {region.population} people
                        </span>
                      </div>
                    </div>
                  </div>
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {region.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">
                      ${region.funded.toLocaleString()} / ${region.goal.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-growth h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {progress.toFixed(1)}% funded
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDonate(region.id);
                  }}
                  className="w-full"
                  variant={isSelected ? "nature" : "outline"}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Donate ${donationAmount}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RegionSelector;