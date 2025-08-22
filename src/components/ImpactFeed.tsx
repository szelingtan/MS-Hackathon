import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, Droplets, MapPin, Clock } from "lucide-react";

interface ImpactStory {
  id: number;
  district: string;
  title: string;
  description: string;
  impact: string;
  date: string;
  image: string;
  likes?: number;
  comments?: number;
  waterReward?: number;
  isLiked?: boolean;
}

const ImpactFeed = () => {
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("all");

  useEffect(() => {
    // Load impact stories from the same JSON file
    const loadImpactStories = async () => {
      try {
        const response = await fetch('/hk-game/data/impact-stories.json');
        const storiesData = await response.json();
        
        // Add social media properties to each story
        const enhancedStories = storiesData.map((story: ImpactStory) => ({
          ...story,
          likes: Math.floor(Math.random() * 50) + 10, // Random likes between 10-60
          comments: Math.floor(Math.random() * 20) + 3, // Random comments between 3-23
          waterReward: Math.floor(Math.random() * 15) + 5, // Random water reward between 5-20
          isLiked: Math.random() > 0.7 // 30% chance of being liked
        }));
        
        setStories(enhancedStories);
      } catch (error) {
        console.error('Error loading impact stories:', error);
        setStories([]);
      }
    };

    loadImpactStories();
  }, []);

  // Get unique districts for filter
  const districts = ["all", ...Array.from(new Set(stories.map(story => story.district)))];

  const filteredStories = selectedDistrict === "all" 
    ? stories 
    : stories.filter(story => story.district === selectedDistrict);

  const handleLike = (storyId: number) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { 
            ...story, 
            isLiked: !story.isLiked,
            likes: story.isLiked ? (story.likes || 0) - 1 : (story.likes || 0) + 1
          }
        : story
    ));
  };

  const getAuthorIcon = (district: string) => {
    // Generate different author types based on district
    const hash = district.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const types = ["👨‍👩‍👧‍👦", "🏫", "🏢"];
    return types[hash % types.length];
  };

  const getAuthorName = (district: string, storyId: number) => {
    // Generate author names based on district and story
    const parentNames = ["Sarah Martinez", "John Chen", "Maria Rodriguez", "David Kim"];
    const schoolNames = [`${district} School District`, `${district} Elementary`];
    const orgNames = [`${district} Community Center`, `${district} Foundation`];
    
    const hash = (district + storyId).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const type = hash % 3;
    
    if (type === 0) return parentNames[hash % parentNames.length];
    if (type === 1) return schoolNames[hash % schoolNames.length];
    return orgNames[hash % orgNames.length];
  };

  const getWaterReward = (storyId: number) => {
    const story = stories.find(s => s.id === storyId);
    if (story) {
      console.log(`Collected ${story.waterReward} water drops!`);
    }
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
        {filteredStories.map((story) => {
          const authorName = getAuthorName(story.district, story.id);
          const authorIcon = getAuthorIcon(story.district);
          
          return (
            <Card key={story.id} className="shadow-soft hover:shadow-plant transition-all duration-300">
              <CardContent className="p-6">
                {/* Author Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`} />
                      <AvatarFallback>
                        {authorIcon}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="font-medium text-foreground">{authorName}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {story.district}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {story.date}
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
                <div className="mb-4">
                  <h3 className="font-semibold text-foreground mb-2">{story.title}</h3>
                  <p className="text-foreground leading-relaxed mb-2">
                    {story.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-plant-growth font-medium">
                    <Heart className="h-3 w-3" />
                    <span>{story.impact}</span>
                  </div>
                </div>

                {/* Image if present */}
                {story.image && (
                  <div className="mb-4">
                    <img 
                      src={story.image} 
                      alt={story.title}
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
          );
        })}
      </div>
      
      {filteredStories.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-4">🌱</div>
            <p className="text-muted-foreground">
              {selectedDistrict === "all" 
                ? "Loading impact stories..." 
                : `No stories from ${selectedDistrict} yet. Check back soon!`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImpactFeed;