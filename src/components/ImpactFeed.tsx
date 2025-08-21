import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, Droplets, MapPin, Clock } from "lucide-react";

interface ImpactStory {
  id: string;
  author: string;
  authorType: "parent" | "school" | "organization";
  region: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  waterReward: number;
  isLiked: boolean;
}

const ImpactFeed = () => {
  const [stories, setStories] = useState<ImpactStory[]>([
    {
      id: "1",
      author: "Sarah Martinez",
      authorType: "parent",
      region: "Sunnydale Elementary",
      timestamp: "2 hours ago",
      content: "Thank you to everyone who donated! My daughter Maria now has access to the new computer lab. She came home so excited about learning to code! 💻✨",
      likes: 24,
      comments: 8,
      waterReward: 10,
      isLiked: false
    },
    {
      id: "2",
      author: "Riverside Community Center",
      authorType: "organization",
      region: "Riverside Community",
      timestamp: "5 hours ago",
      content: "Amazing news! Thanks to your generous donations, we've started our new after-school nutrition program. 50 children now receive healthy meals every day. Here's little Emma enjoying her first meal! 🍎",
      image: "https://images.unsplash.com/photo-1544737151-6e4b3999de6a?w=400",
      likes: 67,
      comments: 15,
      waterReward: 15,
      isLiked: true
    },
    {
      id: "3",
      author: "Green Valley School District",
      authorType: "organization", 
      region: "Green Valley District",
      timestamp: "1 day ago",
      content: "Our sustainability garden is growing! Students planted 50 trees this week and learned about environmental conservation. Your support made this hands-on learning possible! 🌱",
      likes: 43,
      comments: 12,
      waterReward: 20,
      isLiked: false
    }
  ]);

  const [selectedDistrict, setSelectedDistrict] = useState("all");

  const districts = ["all", "Sunnydale Elementary", "Riverside Community", "Green Valley District"];

  const filteredStories = selectedDistrict === "all" 
    ? stories 
    : stories.filter(story => story.region === selectedDistrict);

  const handleLike = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { 
            ...story, 
            isLiked: !story.isLiked,
            likes: story.isLiked ? story.likes - 1 : story.likes + 1
          }
        : story
    ));
  };

  const getAuthorIcon = (type: string) => {
    switch (type) {
      case "parent": return "👨‍👩‍👧‍👦";
      case "school": return "🏫";
      case "organization": return "🏢";
      default: return "👤";
    }
  };

  const getWaterReward = (storyId: string) => {
    // Simulate collecting water reward
    console.log(`Collected ${stories.find(s => s.id === storyId)?.waterReward} water drops!`);
  };

  return (
    <div className="space-y-6">
      {/* District Filter */}
      <div className="flex flex-wrap gap-2">
        {districts.map((district) => (
          <Button
            key={district}
            variant={selectedDistrict === district ? "nature" : "outline"}
            size="sm"
            onClick={() => setSelectedDistrict(district)}
          >
            <MapPin className="h-3 w-3 mr-1" />
            {district === "all" ? "All Districts" : district}
          </Button>
        ))}
      </div>

      {/* Stories Feed */}
      <div className="space-y-4">
        {filteredStories.map((story) => (
          <Card key={story.id} className="shadow-soft hover:shadow-plant transition-all duration-300">
            <CardContent className="p-6">
              {/* Author Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${story.author}`} />
                    <AvatarFallback>
                      {getAuthorIcon(story.authorType)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-medium text-foreground">{story.author}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {story.region}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {story.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getWaterReward(story.id)}
                  className="flex items-center gap-1 text-water hover:bg-water/10"
                >
                  <Droplets className="h-3 w-3" />
                  +{story.waterReward}
                </Button>
              </div>

              {/* Content */}
              <p className="text-foreground mb-4 leading-relaxed">
                {story.content}
              </p>

              {/* Image if present */}
              {story.image && (
                <div className="mb-4">
                  <img 
                    src={story.image} 
                    alt="Impact story"
                    className="w-full h-48 object-cover rounded-lg shadow-soft"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(story.id)}
                    className={story.isLiked ? "text-destructive" : "text-muted-foreground"}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${story.isLiked ? "fill-current" : ""}`} />
                    {story.likes}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {story.comments}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Scroll to bottom for water reward 💧
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredStories.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-4">🌱</div>
            <p className="text-muted-foreground">
              No stories from {selectedDistrict} yet. Check back soon!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImpactFeed;