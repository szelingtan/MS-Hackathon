import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress"; // CHANGED: we render a custom bar to overlay "your" portion
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, MapPin, DollarSign, Clock, Target, Filter, Droplets } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

// MapLibre GL and Turf types
interface MaplibreGL {
  Map: new (options: MapOptions) => MapInstance;
  NavigationControl: new () => NavigationControl;
}

interface MapOptions {
  container: HTMLDivElement;
  style: string;
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
  antialias: boolean;
  preserveDrawingBuffer: boolean;
}

interface MapInstance {
  addControl: (control: NavigationControl) => void;
  on(event: string, callback: (e?: MapEvent) => void): void;
  on(event: string, layer: string, callback: (e?: MapEvent) => void): void;
  addSource: (id: string, source: GeoJSONSource | MaskSource) => void;
  addLayer: (layer: MapLayer) => void;
  setFeatureState: (target: FeatureTarget, state: FeatureState) => void;
  setPaintProperty: (layerId: string, property: string, value: number) => void;
  queryRenderedFeatures: (point: Point, options?: QueryOptions) => Feature[];
  querySourceFeatures: (source: string) => Feature[];
  getFeatureState: (target: FeatureTarget) => FeatureState;
  fitBounds: (bounds: [number, number, number, number], options: FitBoundsOptions) => void;
  flyTo: (options: FlyToOptions) => void;
  getCanvas: () => HTMLCanvasElement;
  remove: () => void;
}

interface NavigationControl { [key: string]: unknown; }

interface MapEvent {
  features?: Feature[];
  point: Point;
}

interface Point { x: number; y: number; }

interface Feature {
  id: string | number;
  properties: Record<string, string | number | boolean | null>;
  geometry: GeoJSONGeometry;
}

interface GeoJSONGeometry {
  type: string;
  coordinates: number[] | number[][] | number[][][];
}

interface GeoJSONSource { type: 'geojson'; data: GeoJSONData; }
interface MaskSource { type: 'geojson'; data: Feature; }

interface GeoJSONData { type: 'FeatureCollection'; features: Feature[]; }

interface MapLayer {
  id: string;
  type: 'fill' | 'line';
  source: string;
  paint: Record<string, unknown>;
}

interface FeatureTarget { source: string; id: string | number; }
interface FeatureState { hover?: boolean; selected?: boolean; }
interface QueryOptions { layers: string[]; }

interface FitBoundsOptions { padding: number; duration: number; }
interface FlyToOptions {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
  duration: number;
}

interface TurfLibrary {
  mask: (polygon: GeoJSONData) => Feature;
  bbox: (feature: Feature) => [number, number, number, number];
}

declare global {
  interface Window {
    maplibregl: MaplibreGL;
    turf: TurfLibrary;
  }
}

interface HongKongMapProps {
  height?: number;
  onDonationUpdate?: () => void;
  onProjectDonate?: (project: DonationProject) => void;
}

interface ImpactStory {
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
}

interface DonationProject {
  id: number;
  district: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  supporters: number;
  urgency: 'low' | 'medium' | 'high';
  category: string;
  image: string;
  userDonation?: number; // Track user's contribution to this project
}

// District name to ID mapping for Firestore (not used for donations)
const districtNameToId: { [key: string]: number } = {
  "Hong Kong Island": 1,
  "Kowloon": 2,
  "New Territories": 3,
  "Outlying Islands": 4
};

// Mapping from map district names to data district names
const mapDistrictToDataDistrict: { [key: string]: string[] } = {
  "Central": ["Central & Western"],
  "Central & Western": ["Central & Western"],
  "Wan Chai": ["Wan Chai"],
  "Eastern": ["Eastern"],
  "Southern": ["Southern"],
  "Kowloon City": ["Kowloon City"],
  "Kwun Tong": ["Kwun Tong"],
  "Sham Shui Po": ["Sham Shui Po"],
  "Wong Tai Sin": ["Wong Tai Sin"],
  "Yau Tsim Mong": ["Yau Tsim Mong"],
  "Islands": ["Islands"],
  "Kwai Tsing": ["Kwai Tsing"],
  "North": ["North"],
  "Sai Kung": ["Sai Kung"],
  "Sha Tin": ["Sha Tin"],
  "Tai Po": ["Tai Po"],
  "Tsuen Wan": ["Tsuen Wan"],
  "Tuen Mun": ["Tuen Mun"],
  "Yuen Long": ["Yuen Long"],
  "Unknown District": []
};

interface SidePanelProps {
  selectedDistrict: string | null;
  stories: ImpactStory[];
  projects: DonationProject[];
  onClearSelection: () => void;
  onDonate: (project: DonationProject) => void;
  panelHeight?: number;
  myDonations?: Record<number, number>; // NEW
}

const StoryDetailModal: React.FC<{
  story: ImpactStory | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ story, isOpen, onClose }) => {
  const { user, addRewardWaterDrops } = useAuth();
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);

  // Check if user has already claimed reward for this story
  useEffect(() => {
    if (story) {
      const claimedStories = JSON.parse(localStorage.getItem('claimed_story_rewards') || '[]');
      setHasClaimedReward(claimedStories.includes(story.id));
    }
  }, [story]);

  const handleClaimWaterDrops = async () => {
    if (!user || !story || hasClaimedReward || isClaimingReward) return;

    setIsClaimingReward(true);
    try {
      // Add 25 water drops to user's account using the reward function
      const result = await addRewardWaterDrops(25);
      
      // Mark this story as claimed in localStorage
      const claimedStories = JSON.parse(localStorage.getItem('claimed_story_rewards') || '[]');
      claimedStories.push(story.id);
      localStorage.setItem('claimed_story_rewards', JSON.stringify(claimedStories));
      setHasClaimedReward(true);
      
      // Dispatch custom event to notify parent components about water drop change
      window.dispatchEvent(new CustomEvent('waterDropsUpdated', {
        detail: { 
          amount: result.rewardAmount,
          newTotal: result.newWaterAmount,
          source: 'story-reward'
        }
      }));
      
      // Show success message with the actual reward amount
      toast.success(`🎉 You earned ${result.rewardAmount} water droplets for reading this story!`);
    } catch (error) {
      console.error('Error claiming water drops:', error);
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
                  <MapPin className="h-4 w-4" />
                  {story.district}
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

            {story.tags && story.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Water droplet reward button */}
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

const SidePanel: React.FC<SidePanelProps> = ({ 
  selectedDistrict, 
  stories, 
  projects, 
  panelHeight = 500, 
  onClearSelection,
  onDonate,
  myDonations // NEW
}) => {
  const [selectedStory, setSelectedStory] = useState<ImpactStory | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  const handleStoryClick = (story: ImpactStory) => {
    setSelectedStory(story);
    setIsStoryModalOpen(true);
  };
  const closeStoryModal = () => { setIsStoryModalOpen(false); setSelectedStory(null); };

  const filteredStories = selectedDistrict 
    ? (() => {
        const mappedDistricts = mapDistrictToDataDistrict[selectedDistrict] || [selectedDistrict];
        if (mappedDistricts.length === 0) return stories;
        return stories.filter(story => mappedDistricts.includes(story.district));
      })()
    : stories;
    
  const filteredProjects = selectedDistrict
    ? (() => {
        const mappedDistricts = mapDistrictToDataDistrict[selectedDistrict] || [selectedDistrict];
        if (mappedDistricts.length === 0) return projects;
        return projects.filter(project => mappedDistricts.includes(project.district));
      })()
    : projects;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-HK', { style: 'currency', currency: 'HKD', minimumFractionDigits: 0 }).format(amount);

  return (
    <>
      <Card className="h-full shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              {selectedDistrict ? selectedDistrict : "All Districts"}
            </div>
            {selectedDistrict && (
              <Button variant="ghost" size="sm" onClick={onClearSelection}>
                <Filter className="h-4 w-4" />
                Clear
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto pb-6" style={{ height: `calc(${panelHeight}px - 4rem)` }}>
          <Tabs defaultValue="stories" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stories">Stories</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="stories" className="mt-4">
              {filteredStories.length > 0 ? (
                <div className="space-y-4">
                  {filteredStories.map((story) => (
                    <Card 
                      key={story.id} 
                      className="border-l-4 border-l-plant-growth cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleStoryClick(story)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-sm text-foreground mb-2">{story.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-3">
                          {story.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{story.district}</span>
                          <span>{story.date}</span>
                        </div>
                        <div className="mt-2 text-xs text-accent hover:text-accent/80">Click to read full story →</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Stories Yet</h3>
                  <p className="text-muted-foreground">
                    No impact stories available {selectedDistrict ? `for ${selectedDistrict}` : ''} yet.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects" className="mt-4">
              {filteredProjects.length > 0 ? (
                <div className="space-y-4">
                  {filteredProjects.map((project) => {
                    const myAmount = myDonations?.[project.id] || 0; // NEW
                    const totalPct = Math.min((project.raised / project.goal) * 100, 100);
                    const myPct = Math.min((myAmount / project.goal) * 100, 100);
                    return (
                      <Card key={project.id} className="border-l-4 border-l-accent">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm text-foreground mb-1">{project.title}</h4>
                              <Badge className={`text-xs ${getUrgencyColor(project.urgency)}`}>
                                <Clock className="h-3 w-3 mr-1" />
                                {project.urgency.charAt(0).toUpperCase() + project.urgency.slice(1)} Priority
                              </Badge>
                            </div>
                            <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{Math.round(totalPct)}% funded</span>
                            </div>

                            {/* Progress bar with overlay for "your" donation */}
                            <div className="relative w-full h-2 rounded-md bg-secondary/40 overflow-hidden">
                              <div
                                className="absolute inset-y-0 left-0 bg-primary/70"
                                style={{ width: `${totalPct}%` }}
                              />
                              {myAmount > 0 && (
                                <div
                                  className="absolute inset-y-0 left-0 bg-emerald-500/80"
                                  style={{ width: `${myPct}%`, borderRight: '2px solid white' }}
                                  title={`Your donations: ${formatCurrency(myAmount)}`}
                                />
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-sm">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-plant-growth">
                                    {formatCurrency(project.raised)}
                                  </span>
                                  <span className="text-muted-foreground">
                                    / {formatCurrency(project.goal)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="inline-flex items-center gap-1">
                                    <span className="inline-block w-3 h-2 rounded bg-primary/70" /> total
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <span className="inline-block w-3 h-2 rounded bg-emerald-500/80" /> your part
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  <span>{project.supporters} supporters</span>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="nature" 
                                className="whitespace-nowrap"
                                onClick={() => onDonate(project)}
                              >
                                <Heart className="h-3 w-3 mr-1" />
                                Donate
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Projects</h3>
                  <p className="text-muted-foreground">
                    No donation projects available {selectedDistrict ? `for ${selectedDistrict}` : ''} at the moment.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <StoryDetailModal story={selectedStory} isOpen={isStoryModalOpen} onClose={closeStoryModal} />
    </>
  );
};

// Helper functions moved outside component for stability
const loadMyDonations = () => {
  try {
    const raw = localStorage.getItem('hk_game_my_donations');
    return raw ? (JSON.parse(raw) as Record<number, number>) : {};
  } catch { return {}; }
};

const saveMyDonations = (obj: Record<number, number>) => {
  try { 
    localStorage.setItem('hk_game_my_donations', JSON.stringify(obj)); 
  } catch (error) {
    console.error('Failed to save donations:', error);
  }
};

const HongKongMap = ({ height = 500, onDonationUpdate, onProjectDonate }: HongKongMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapInstance | null>(null);
  const mapInitialized = useRef<boolean>(false);
  const selectedFeatureId = useRef<string | number | null>(null);
  
  // Side panel data and state
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [projects, setProjects] = useState<DonationProject[]>([]);

  // NEW: track "your" donations for overlay (local only)
  const [myDonations, setMyDonations] = useState<Record<number, number>>({}); // projectId -> amount

  // Donation dialog state (kept minimal)
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  
  const { user, processDonation } = useAuth(); // CHANGED: do not call processDonation here (donations aren't via Firestore)

  useEffect(() => { setMyDonations(loadMyDonations()); }, []);

  // Load stories and projects data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storiesRes, projectsRes] = await Promise.all([
          fetch('/hk-game/data/impact-stories.json'),
          fetch('/hk-game/data/donation-projects.json')
        ]);
        
        if (storiesRes.ok) {
          const storiesData = await storiesRes.json();
          setStories(storiesData);
        }
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          
          // Load user donations and combine with project data
          const userDonations = loadMyDonations();
          
          // Add user donations to the project totals
          const updatedProjects = projectsData.map(project => {
            const userAmount = userDonations[project.id] || 0;
            return {
              ...project,
              userDonation: userAmount, // Track user donation separately
              raised: project.raised + userAmount // Add user donation to total raised
            };
          });
          
          setProjects(updatedProjects);
          setMyDonations(userDonations);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleDonationEvent = (e: Event) => {
      const { projectId, amount } = (e as CustomEvent).detail;
      console.log('Map received donation event:', { projectId, amount }); // Debug log
      
      if (projectId && amount) {
        // Update the local state immediately for UI responsiveness
        setProjects(prev => {
          const updated = prev.map(p => p.id === projectId
            ? { ...p, raised: p.raised + amount, supporters: p.supporters + 1 }
            : p
          );
          console.log('Updated projects:', updated.find(p => p.id === projectId)); // Debug log
          return updated;
        });

        // Update user donations tracking
        setMyDonations(prev => {
          const next = { ...prev, [projectId]: (prev[projectId] || 0) + amount };
          saveMyDonations(next);
          console.log('Updated my donations:', next); // Debug log
          return next;
        });
        
        // Reload data from localStorage to get updated user donations
        const userDonations = loadMyDonations();
        console.log('Reloaded user donations from localStorage:', userDonations); // Debug log
        setMyDonations(userDonations);
        
        // Update projects with new user donation amounts
        setProjects(prev => prev.map(project => {
          if (project.id === projectId) {
            const userAmount = userDonations[project.id] || 0;
            return {
              ...project,
              userDonation: userAmount
            };
          }
          return project;
        }));
      }
    };
    
    const mapElement = mapContainer.current;
    if (mapElement) {
      mapElement.setAttribute('data-hongkong-map', '');
      mapElement.addEventListener('donation-made', handleDonationEvent);
      console.log('Map component set up donation event listener'); // Debug log
      return () => {
        mapElement.removeEventListener('donation-made', handleDonationEvent);
      };
    }
  }, []);

  // CHANGED: keep slight zoom + mask effect from first code
  const handleDistrictClick = (districtName: string) => {
    setSelectedDistrict(districtName);
    setSelectedRegion(districtName);
  };

  const handleClearSelection = () => {
    setSelectedDistrict(null);
    setSelectedRegion('');
    if (selectedFeatureId.current) {
      map.current!.setFeatureState({ source: 'hk', id: selectedFeatureId.current }, { selected: false });
      selectedFeatureId.current = null;
    }
    // NEW: reset mask + camera
    if (map.current) {
      map.current.setPaintProperty('outside-mask-fill', 'fill-opacity', 0.3);
      map.current.flyTo({
        center: [114.1694, 22.3193],
        zoom: 9.6,
        pitch: 50,
        bearing: -10,
        duration: 1000
      });
    }
  };

  // NEW: attempt server persistence; no-op if endpoint is absent
  const persistDonation = async (projectId: number, amount: number) => {
    try {
      // 1) append to donations log JSON
      await fetch('/hk-game/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          amount,
          userId: user?.user_id || 'anon',
          ts: Date.now()
        })
      }).catch(() => { /* ignore network/API absence */ });

      // 2) update project raised/supporters in projects JSON
      await fetch('/hk-game/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          delta: amount,
          supporterDelta: 1
        })
      }).catch(() => {});

      if (onDonationUpdate) onDonationUpdate();
    } catch (e) {
      console.warn('Persist donation failed; kept local only.', e);
    }
  };

  const handleProjectDonate = async (project: DonationProject) => {
    if (onProjectDonate) {
      // Just delegate to parent component - don't show any prompts
      onProjectDonate(project);
      // Parent will handle the dialog and updating all state
      return;
    }
    
    // This is the fallback if no parent handler (only for standalone testing)
    const input = window.prompt(`Donate to "${project.title}" (HKD):`, '100');
    if (!input) return;
    const amount = Number(input);
    if (!isFinite(amount) || amount <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    
    // Apply donation locally for fallback case
    setProjects(prev =>
      prev.map(p => p.id === project.id
        ? { ...p, raised: p.raised + amount, supporters: p.supporters + 1 }
        : p
      )
    );

    setMyDonations(prev => {
      const next = { ...prev, [project.id]: (prev[project.id] || 0) + amount };
      saveMyDonations(next);
      return next;
    });
    
    persistDonation(project.id, amount);
    toast.success('Thank you for your donation!');
  };

  // Initialize map scripts and map instance once
  useEffect(() => {
    if (mapInitialized.current) return;
    
    const initializeMap = async () => {
      if (!mapContainer.current || map.current) return;

      map.current = new window.maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [114.1694, 22.3193],
        zoom: 9.6,
        pitch: 50,
        bearing: -10,
        antialias: true,
        preserveDrawingBuffer: true
      });

      map.current.addControl(new window.maplibregl.NavigationControl());

      map.current.on('load', async () => {
        try {
          const res = await fetch('/hk-game/data/hk18.json');
          const geojson = await res.json() as GeoJSONData;
          
          geojson.features.forEach((f: Feature, i: number) => { 
            const objectId = f.properties.OBJECTID;
            const fid = f.properties.FID;
            f.id = (typeof objectId === 'string' || typeof objectId === 'number' ? objectId : 
                   typeof fid === 'string' || typeof fid === 'number' ? fid : 
                   i.toString());
          });

          map.current!.addSource('hk', { type: 'geojson', data: geojson });

          // mask for outside HK
          const maskFeature = window.turf.mask(geojson);
          map.current!.addSource('outside-mask', { type: 'geojson', data: maskFeature });

          map.current!.addLayer({
            id: 'outside-mask-fill',
            type: 'fill',
            source: 'outside-mask',
            paint: { 'fill-color': '#000', 'fill-opacity': 0.3 }
          });

          map.current!.addLayer({
            id: 'hk-fill',
            type: 'fill',
            source: 'hk',
            paint: {
              'fill-color': [
                'case',
                ['==', ['feature-state', 'selected'], true], '#ffcc00',
                ['==', ['feature-state', 'hover'], true], '#f28cb1',
                'rgba(0,0,0,0)'
              ],
              'fill-opacity': 1
            }
          });

          map.current!.addLayer({
            id: 'hk-outline',
            type: 'line',
            source: 'hk',
            paint: {
              'line-color': [
                'case',
                ['==', ['feature-state', 'selected'], true], '#000',
                ['==', ['feature-state', 'hover'], true], '#fff',
                '#2d3a6a'
              ],
              'line-width': [
                'case',
                ['==', ['feature-state', 'selected'], true], 3,
                ['==', ['feature-state', 'hover'], true], 2,
                1
              ]
            }
          });

          // interactions (CHANGED + NEW zoom/mask)
          let hoverId: string | number | null = null;

          map.current!.on('mousemove', 'hk-fill', (e: MapEvent) => {
            if (e.features && e.features.length > 0) {
              const feature = e.features[0] as Feature;
              const newHoverId = feature.id as string | number;
              if (hoverId && hoverId !== newHoverId) {
                map.current!.setFeatureState({ source: 'hk', id: hoverId }, { hover: false });
              }
              if (newHoverId !== hoverId) {
                hoverId = newHoverId;
                map.current!.setFeatureState({ source: 'hk', id: hoverId }, { hover: true });
              }
              map.current!.getCanvas().style.cursor = 'pointer'; // NEW
            }
          });

          map.current!.on('mouseleave', 'hk-fill', () => {
            if (hoverId !== null) {
              map.current!.setFeatureState({ source: 'hk', id: hoverId }, { hover: false });
              hoverId = null;
            }
            map.current!.getCanvas().style.cursor = ''; // NEW
          });

          map.current!.on('click', 'hk-fill', (e: MapEvent) => {
            if (e.features && e.features.length > 0) {
              const feature = e.features[0] as Feature;

              const districtName = 
                feature.properties.ENAME || 
                feature.properties.Name_en || 
                feature.properties.NAME_EN ||
                feature.properties.DISTRICT ||
                feature.properties.District ||
                feature.properties.name ||
                feature.properties.NAME ||
                feature.properties.CNAME ||
                'Unknown District';
              
              handleDistrictClick(String(districtName));
              
              // clear previous selection
              if (selectedFeatureId.current) {
                map.current!.setFeatureState({ source: 'hk', id: selectedFeatureId.current }, { selected: false });
              }
              // new selection
              selectedFeatureId.current = feature.id as string | number;
              map.current!.setFeatureState({ source: 'hk', id: feature.id }, { selected: true });

              // NEW: slight zoom into the clicked district + dim outside
              try {
                const bbox = window.turf.bbox(feature);
                map.current!.fitBounds(bbox, { padding: 50, duration: 1000 });
                map.current!.setPaintProperty('outside-mask-fill', 'fill-opacity', 0.1);
              } catch (err) {
                console.warn('fitBounds failed, falling back to no zoom.', err);
              }
            }
          });

          // NEW: click on empty map clears selection (like first code)
          map.current!.on('click', (e: MapEvent) => {
            const feats = map.current!.queryRenderedFeatures(e.point, { layers: ['hk-fill'] });
            if (feats.length === 0 && selectedFeatureId.current !== null) {
              handleClearSelection();
            }
          });

        } catch (error) {
          console.error('Error loading Hong Kong data:', error);
        }
      });
    };

    const loadScripts = async () => {
      const cssLink = document.createElement('link');
      cssLink.href = 'https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.css';
      cssLink.rel = 'stylesheet';
      document.head.appendChild(cssLink);

      if (!window.maplibregl) {
        const maplibreScript = document.createElement('script');
        maplibreScript.src = 'https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.js';
        document.head.appendChild(maplibreScript);
        await new Promise<void>((resolve) => { maplibreScript.onload = () => resolve(); });
      }

      if (!window.turf) {
        const turfScript = document.createElement('script');
        turfScript.src = 'https://unpkg.com/@turf/turf@6/turf.min.js';
        document.head.appendChild(turfScript);
        await new Promise<void>((resolve) => { turfScript.onload = () => resolve(); });
      }

      mapInitialized.current = true;
      initializeMap();
    };
    
    loadScripts();
    
    return () => {
      if (map.current) { map.current.remove(); map.current = null; }
    };
  }, []);

  return (
    <div className="flex gap-4 h-full">
      {/* Map */}
      <div className="flex-1 relative">
        <div 
          ref={mapContainer} 
          className="w-full rounded-lg border border-border shadow-soft"
          style={{ height: `${height}px` }}
        />
      </div>

      {/* Side Panel */}
      <div className="w-96">
        <SidePanel
          selectedDistrict={selectedDistrict}
          stories={stories}
          projects={projects}
          onClearSelection={handleClearSelection}
          onDonate={handleProjectDonate}
          panelHeight={height}
          myDonations={myDonations} // NEW
        />
      </div>
    </div>
  );
};

export default HongKongMap;
