import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const ProfileProgress = ({ user }) => {
  // safe defaults
  const donatedAmount = user?.donated_amount ?? 0;
  const plantCount = user?.inventory?.plants?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center shadow-soft">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-plant-growth">
              ${donatedAmount}
            </div>
            <p className="text-sm text-muted-foreground">Total Donated</p>
          </CardContent>
        </Card>

        <Card className="text-center shadow-soft">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-water">7</div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>

        <Card className="text-center shadow-soft">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-earth">{plantCount}</div>
            <p className="text-sm text-muted-foreground">Plants Collected</p>
          </CardContent>
        </Card>

        <Card className="text-center shadow-soft">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-accent">3</div>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Level 3</h3>
                <p className="text-sm text-muted-foreground">
                  Community Supporter
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">850 / 1000 XP</p>
                <p className="text-sm text-muted-foreground">
                  150 XP to next level
                </p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-gradient-growth h-3 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                date: "2024-01-15",
                action: "Donated $25 to Sunnydale Elementary",
                xp: 25,
              },
              { date: "2024-01-14", action: "Completed daily check-in", xp: 5 },
              { date: "2024-01-13", action: "Voted in plant competition", xp: 10 },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  +{activity.xp} XP
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileProgress;
