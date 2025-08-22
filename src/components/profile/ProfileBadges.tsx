import { Badge, Gift, Heart, Star, TreePine, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const ProfileBadges = ({ user }) => {
  const badges = [
    { id: "early-supporter", name: "Early Supporter", icon: Star, color: "text-accent", description: "One of the first 100 donors" },
    { id: "team-champion", name: "Team Champion", icon: Users, color: "text-plant-growth", description: "Recruited 5+ donors" },
    { id: "100-lives", name: "100 Lives Touched", icon: Heart, color: "text-destructive", description: "Impacted 100+ students" },
    { id: "plant-master", name: "Plant Master", icon: TreePine, color: "text-plant-base", description: "Reached max plant level" },
    { id: "generous-giver", name: "Generous Giver", icon: Gift, color: "text-earth", description: "Donated $1000+" }
  ];

  const earnedBadges = ["early-supporter", "team-champion", "100-lives"];
  const isBadgeEarned = (badgeId) => earnedBadges.includes(badgeId);

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Your Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const IconComponent = badge.icon;
              const isEarned = isBadgeEarned(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isEarned
                      ? 'bg-gradient-to-br from-plant-base/20 to-plant-growth/20 border-plant-base/30 shadow-plant'
                      : 'bg-muted/30 border-muted opacity-60'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`p-3 rounded-full ${isEarned ? 'bg-plant-growth/20' : 'bg-muted'}`}>
                      <IconComponent className={`h-6 w-6 ${isEarned ? badge.color : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${isEarned ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {badge.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {badge.description}
                      </p>
                    </div>
                    {isEarned && (
                      <Badge className="bg-plant-growth/20 text-plant-growth border-plant-growth/30">
                        Earned! ✓
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileBadges