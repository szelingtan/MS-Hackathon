import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, MapPin, DollarSign, Clock, Target, Filter } from "lucide-react";
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

interface NavigationControl {
  // MapLibre Navigation Control interface
  [key: string]: unknown;
}

interface MapEvent {
  features: Feature[];
  point: Point;
}

interface Point {
  x: number;
  y: number;
}

interface Feature {
  id: string | number;
  properties: Record<string, string | number>;
  geometry: GeoJSONGeometry;
}

interface GeoJSONGeometry {
  type: string;
  coordinates: number[] | number[][] | number[][][];
}

interface GeoJSONSource {
  type: 'geojson';
  data: GeoJSONData;
}

interface MaskSource {
  type: 'geojson';
  data: Feature;
}

interface GeoJSONData {
  type: 'FeatureCollection';
  features: Feature[];
}

interface MapLayer {
  id: string;
  type: 'fill' | 'line';
  source: string;
  paint: Record<string, unknown>;
}

interface FeatureTarget {
  source: string;
  id: string | number;
}

interface FeatureState {
  hover?: boolean;
  selected?: boolean;
}

interface QueryOptions {
  layers: string[];
}

interface FitBoundsOptions {
  padding: number;
  duration: number;
}

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
}

// District name to ID mapping for Firestore
const districtNameToId: { [key: string]: number } = {
  "Hong Kong Island": 1,
  "Kowloon": 2,
  "New Territories": 3,
  "Outlying Islands": 4
};

// Mapping from map district names to data district names
const mapDistrictToDataDistrict: { [key: string]: string[] } = {
  // Map commonly used names to actual district names in the data
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
  // Fallback for any unmatched districts - show all
  "Unknown District": []
};

interface SidePanelProps {
  selectedDistrict: string | null;
  stories: ImpactStory[];
  projects: DonationProject[];
  onClearSelection: () => void;
  onDonate: (project: DonationProject) => void;
  panelHeight?: number;
}

const StoryDetailModal: React.FC<{
  story: ImpactStory | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ story, isOpen, onClose }) => {
  if (!isOpen || !story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl max-h-[80vh] overflow-y-auto m-4 w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{story.title}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {story.district}
                </span>
                <span>{story.date}</span>
                {story.category && (
                  <Badge variant="secondary">{story.category}</Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Image */}
          {story.image && (
            <div className="mb-6">
              <img 
                src={story.image} 
                alt={story.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Story</h3>
              <p className="text-muted-foreground leading-relaxed">
                {story.fullDescription || story.description}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Impact</h3>
              <p className="text-muted-foreground leading-relaxed">
                {story.impact}
              </p>
            </div>

            {/* Additional details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {story.beneficiaries && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="text-sm">
                    <strong>{story.beneficiaries}</strong> people helped
                  </span>
                </div>
              )}
              
              {story.volunteer && (
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-accent" />
                  <span className="text-sm">
                    Volunteer: <strong>{story.volunteer}</strong>
                  </span>
                </div>
              )}

              {story.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="text-sm">
                    Location: <strong>{story.location}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
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
  onDonate 
}) => {
  // Add state for story modal
  const [selectedStory, setSelectedStory] = useState<ImpactStory | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // Add handler for story click
  const handleStoryClick = (story: ImpactStory) => {
    setSelectedStory(story);
    setIsStoryModalOpen(true);
  };

  const closeStoryModal = () => {
    setIsStoryModalOpen(false);
    setSelectedStory(null);
  };

  const filteredStories = selectedDistrict 
    ? (() => {
        const mappedDistricts = mapDistrictToDataDistrict[selectedDistrict] || [selectedDistrict];
        if (mappedDistricts.length === 0) return stories; // Show all if no mapping
        return stories.filter(story => mappedDistricts.includes(story.district));
      })()
    : stories;
    
  const filteredProjects = selectedDistrict
    ? (() => {
        const mappedDistricts = mapDistrictToDataDistrict[selectedDistrict] || [selectedDistrict];
        if (mappedDistricts.length === 0) return projects; // Show all if no mapping
        return projects.filter(project => mappedDistricts.includes(project.district));
      })()
    : projects;

  console.log('Selected District:', selectedDistrict);
  console.log('Mapped Districts:', mapDistrictToDataDistrict[selectedDistrict || '']);
  console.log('Filtered Stories:', filteredStories.length);
  console.log('Filtered Projects:', filteredProjects.length);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-HK', {
      style: 'currency',
      currency: 'HKD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
                      <div className="mt-2 text-xs text-accent hover:text-accent/80">
                        Click to read full story →
                      </div>
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
                  const progress = (project.raised / project.goal) * 100;
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
                          <Badge variant="secondary" className="text-xs">
                            {project.category}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {project.description}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progress.toFixed(0)}% funded</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          
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

      {/* Story Detail Modal */}
      <StoryDetailModal
        story={selectedStory}
        isOpen={isStoryModalOpen}
        onClose={closeStoryModal}
      />
    </>
  );
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
  
  // Donation dialog state (removed - now handled by parent)
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  
  // Get auth hook for donations
  const { processDonation, user } = useAuth();

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
          console.log('Loaded stories:', storiesData);
          console.log('Unique story districts:', [...new Set(storiesData.map((s: ImpactStory) => s.district))]);
        }
        
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData);
          console.log('Loaded projects:', projectsData);
          console.log('Unique project districts:', [...new Set(projectsData.map((p: DonationProject) => p.district))]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  const handleDistrictClick = (districtName: string) => {
    console.log('District clicked:', districtName);
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
  };

  const handleProjectDonate = (project: DonationProject) => {
    if (onProjectDonate) {
      onProjectDonate(project);
    }
  };

  // Initialize map scripts and map instance once
  useEffect(() => {
    if (mapInitialized.current) return;
    
    // Handle map initialization and district data
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
            f.id = f.properties.OBJECTID || f.properties.FID || i.toString();
          });

          map.current!.addSource('hk', { type: 'geojson', data: geojson });

          // Add mask for unselected areas
          const maskFeature = window.turf.mask(geojson);
          map.current!.addSource('outside-mask', { type: 'geojson', data: maskFeature });

          map.current!.addLayer({
            id: 'outside-mask-fill',
            type: 'fill',
            source: 'outside-mask',
            paint: { 
              'fill-color': '#000', 
              'fill-opacity': 0.3
            }
          });

          // Add district fills for interaction
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

          // Add district outlines
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

          // Setup map interactions
          const setupMapInteractions = () => {
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
              }
            });

            map.current!.on('mouseleave', 'hk-fill', () => {
              if (hoverId !== null) {
                map.current!.setFeatureState({ source: 'hk', id: hoverId }, { hover: false });
                hoverId = null;
              }
            });

            map.current!.on('click', 'hk-fill', (e: MapEvent) => {
              if (e.features && e.features.length > 0) {
                const feature = e.features[0] as Feature;
                console.log('Feature properties:', feature.properties);
                
                // Try multiple possible property names for district
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
                
                console.log('Extracted district name:', districtName);
                
                // Handle district selection
                handleDistrictClick(String(districtName));
                
                // Clear previous selection
                if (selectedFeatureId.current) {
                  map.current!.setFeatureState({ source: 'hk', id: selectedFeatureId.current }, { selected: false });
                }
                
                // Set new selection
                selectedFeatureId.current = feature.id as string | number;
                map.current!.setFeatureState({ source: 'hk', id: feature.id }, { selected: true });
              }
            });
          };

          setupMapInteractions();
        } catch (error) {
          console.error('Error loading Hong Kong data:', error);
        }
      });
    };

    const loadScripts = async () => {
      // Load MapLibre GL CSS
      const cssLink = document.createElement('link');
      cssLink.href = 'https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.css';
      cssLink.rel = 'stylesheet';
      document.head.appendChild(cssLink);

      // Load MapLibre GL JS
      if (!window.maplibregl) {
        const maplibreScript = document.createElement('script');
        maplibreScript.src = 'https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.js';
        document.head.appendChild(maplibreScript);
        await new Promise<void>((resolve) => { 
          maplibreScript.onload = () => resolve(); 
        });
      }

      // Load Turf.js
      if (!window.turf) {
        const turfScript = document.createElement('script');
        turfScript.src = 'https://unpkg.com/@turf/turf@6/turf.min.js';
        document.head.appendChild(turfScript);
        await new Promise<void>((resolve) => { 
          turfScript.onload = () => resolve(); 
        });
      }

      mapInitialized.current = true;
      initializeMap();
    };
    
    loadScripts();
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="flex gap-4 h-full">
      {/* Map Container */}
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
        />
      </div>
    </div>
  );
};


export default HongKongMap;