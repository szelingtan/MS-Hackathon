import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const ProfileCommendations = () => {
  const commendations = [
    {
      id: 1,
      from: "Sunnydale Elementary",
      message: "Your generous donation helped us build our new computer lab. The children are thriving with access to technology!",
      date: "2024-01-15",
      type: "school",
      impact: "25 students gained computer access"
    },
    {
      id: 2,
      from: "Project Reach Team",
      message: "Thank you for being one of our most dedicated supporters. Your consistency inspires others to give.",
      date: "2024-01-10",
      type: "organization",
      impact: "Inspired 8 new donors"
    },
    {
      id: 3,
      from: "Community Member - Lisa Chen",
      message: "Your beautiful garden motivated me to start donating too. What an amazing example of kindness!",
      date: "2024-01-08",
      type: "peer",
      impact: "Led to $200 in additional donations"
    }
  ];

  const getCommendationIcon = (type) => {
    switch (type) {
      case "school": return "🏫";
      case "organization": return "🏢";
      case "peer": return "👥";
      case "community": return "🏘️";
      default: return "💝";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-destructive" />
            Messages of Appreciation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {commendations.map((commendation) => (
            <div 
              key={commendation.id} 
              className="p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg border border-pink-200"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getCommendationIcon(commendation.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{commendation.from}</h4>
                    <span className="text-xs text-muted-foreground">{commendation.date}</span>
                  </div>
                  <blockquote className="text-sm text-muted-foreground italic mb-3">
                    "{commendation.message}"
                  </blockquote>
                  <Badge variant="outline" className="text-xs bg-pink-100 text-pink-700 border-pink-300">
                    {commendation.impact}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCommendations;