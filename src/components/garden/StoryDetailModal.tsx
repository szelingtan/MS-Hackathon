import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, Heart, MapPin, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export interface ImpactStory {
  id: number;
  district: string;
  title: string;
  description: string;
  impact: string;
  date: string;
  image: string;
  fullDescription?: string;
  beneficiaries?: number;
  volunteer?: string;
  category?: string;
  tags?: string[];
  location?: string;
  userDonated?: number | boolean;
}

export const StoryDetailModal: React.FC<{
  story: ImpactStory | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ story, isOpen, onClose }) => {
  const { user, addRewardWaterDrops } = useAuth();
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);

  useEffect(() => {
    if (story) {
      const claimed = JSON.parse(localStorage.getItem('claimed_story_rewards') || '[]');
      setHasClaimedReward(claimed.includes(story.id));
    }
  }, [story]);

  const handleClaimWaterDrops = async () => {
    if (!user || !story || hasClaimedReward || isClaimingReward) return;
    setIsClaimingReward(true);
    try {
      const result = await addRewardWaterDrops(25);
      const claimed = JSON.parse(localStorage.getItem('claimed_story_rewards') || '[]');
      claimed.push(story.id);
      localStorage.setItem('claimed_story_rewards', JSON.stringify(claimed));
      setHasClaimedReward(true);
      window.dispatchEvent(new CustomEvent('waterDropsUpdated', {
        detail: { amount: result.rewardAmount, newTotal: result.newWaterAmount, source: 'story-reward' }
      }));
      toast.success(`🎉 You earned ${result.rewardAmount} water droplets for reading this story!`);
    } catch {
      toast.error('Failed to claim water drops. Please try again.');
    } finally {
      setIsClaimingReward(false);
    }
  };

  if (!isOpen || !story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl max-h-[80vh] overflow-y-auto m-4 w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{story.title}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {story.district}
                </span>
                <span>{story.date}</span>
                {story.category && <Badge variant="secondary">{story.category}</Badge>}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>

          {story.image && (
            <div className="mb-6">
              <img src={story.image} alt={story.title} className="w-full h-48 object-cover rounded-lg" />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Story</h3>
              <p className="text-muted-foreground leading-relaxed">
                {story.fullDescription || story.description}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Impact</h3>
              <p className="text-muted-foreground leading-relaxed">{story.impact}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {story.beneficiaries && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="text-sm"><strong>{story.beneficiaries}</strong> people helped</span>
                </div>
              )}
              {story.volunteer && (
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-accent" />
                  <span className="text-sm">Volunteer: <strong>{story.volunteer}</strong></span>
                </div>
              )}
              {story.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="text-sm">Location: <strong>{story.location}</strong></span>
                </div>
              )}
            </div>

            {story.tags?.length ? (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {user && (
              <div className="pt-4 border-t">
                <Button
                  onClick={handleClaimWaterDrops}
                  disabled={hasClaimedReward || isClaimingReward}
                  className="w-full flex items-center justify-center gap-2"
                  variant={hasClaimedReward ? "outline" : "default"}
                >
                  <Droplets className="h-4 w-4" />
                  {isClaimingReward ? 'Claiming...' :
                    hasClaimedReward ? 'Reward Already Claimed' :
                    'Get free 25 water droplets'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
