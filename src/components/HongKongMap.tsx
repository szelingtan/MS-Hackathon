import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, MapPin, DollarSign, Clock, Target, Filter } from "lucide-react";

declare global {
  interface Window {
    maplibregl: any;
    turf: any;
  }
}

interface ImpactStory {
  id: number;
  district: string;
  title: string;
  description: string;
  impact: string;
  date: string;
  image: string;
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

interface SidePanelProps {
  selectedDistrict: string | null;
  stories: ImpactStory[];
  projects: DonationProject[];
  onClearSelection: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ selectedDistrict, stories, projects, onClearSelection }) => {
  const filteredStories = selectedDistrict 
    ? stories.filter(story => story.district === selectedDistrict)
    : stories;
    
  const filteredProjects = selectedDistrict
    ? projects.filter(project => project.district === selectedDistrict)
    : projects;

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
    <Card className="h-full shadow-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-accent" />
          <CardTitle>
            {selectedDistrict ? selectedDistrict : "All Districts"}
          </CardTitle>
        </div>
        {selectedDistrict && (
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <Filter className="h-4 w-4 mr-1" />
            Clear Filter
          </Button>
        )}
      </CardHeader>
      <CardContent className="overflow-y-auto pb-6" style={{ height: "calc(500px - 4rem)" }}>
        <Tabs defaultValue="stories" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stories" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Impact Stories ({filteredStories.length})
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Donation Projects ({filteredProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stories" className="mt-4">
            {filteredStories.length > 0 ? (
              <div className="space-y-4">
                {filteredStories.map((story) => (
                  <Card key={story.id} className="border-l-4 border-l-plant-growth">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm text-foreground">{story.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {story.date}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {story.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-plant-growth font-medium">
                          <Heart className="h-3 w-3" />
                          {story.impact}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {story.district}
                        </Badge>
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
                  <Button size="sm" variant="nature" className="whitespace-nowrap">
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
  );
};

const HongKongMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const mapInitialized = useRef<boolean>(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [impactStories, setImpactStories] = useState<ImpactStory[]>([]);
  const [donationProjects, setDonationProjects] = useState<DonationProject[]>([]);

  // Load impact stories and donation projects data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storiesResponse, projectsResponse] = await Promise.all([
          fetch('/hk-game/data/impact-stories.json'),
          fetch('/hk-game/data/donation-projects.json')
        ]);
        
        if (!storiesResponse.ok || !projectsResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const stories = await storiesResponse.json();
        const projects = await projectsResponse.json();
        
        setImpactStories(stories);
        setDonationProjects(projects);
      } catch (error) {
        console.error('Error loading data:', error);
        setImpactStories([]);
        setDonationProjects([]);
      }
    };

    loadData();
  }, []);

  // Initialize map scripts and map instance once
  useEffect(() => {
    if (mapInitialized.current) return;
    
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
        await new Promise((resolve) => { maplibreScript.onload = resolve; });
      }

      // Load Turf.js
      if (!window.turf) {
        const turfScript = document.createElement('script');
        turfScript.src = 'https://unpkg.com/@turf/turf@6/turf.min.js';
        document.head.appendChild(turfScript);
        await new Promise((resolve) => { turfScript.onload = resolve; });
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
        const geojson = await res.json();
        
        geojson.features.forEach((f: any, i: number) => { 
          f.id = f.properties.OBJECTID || f.properties.FID || i;
        });

        map.current.addSource('hk', { type: 'geojson', data: geojson });

        // Add mask for unselected areas
        const maskFeature = window.turf.mask(geojson);
        map.current.addSource('outside-mask', { type: 'geojson', data: maskFeature });

        map.current.addLayer({
          id: 'outside-mask-fill',
          type: 'fill',
          source: 'outside-mask',
          paint: { 
            'fill-color': '#000', 
            'fill-opacity': 0.3
          }
        });

        // Add district fills for interaction
        map.current.addLayer({
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
        map.current.addLayer({
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

        setupMapInteractions();
      } catch (error) {
        console.error('Error loading Hong Kong data:', error);
      }
    });
  };

  // Handle map interactions (hover, click, etc.)
  const setupMapInteractions = () => {
    if (!map.current) return;
    
    let hoveredId: any = null;
    let selectedId: any = null;

    map.current.on('mousemove', 'hk-fill', (e: any) => {
      if (!e.features.length) return;
      const id = e.features[0].id;
      
      if (id === undefined || id === null) return;
      
      if (hoveredId !== null && hoveredId !== undefined) {
        map.current.setFeatureState({ source: 'hk', id: hoveredId }, { hover: false });
      }
      hoveredId = id;
      map.current.setFeatureState({ source: 'hk', id: hoveredId }, { hover: true });
      map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'hk-fill', () => {
      if (hoveredId !== null && hoveredId !== undefined) {
        map.current.setFeatureState({ source: 'hk', id: hoveredId }, { hover: false });
      }
      hoveredId = null;
      map.current.getCanvas().style.cursor = '';
    });

    map.current.on('click', 'hk-fill', (e: any) => {
      if (!e.features.length) return;
      const f = e.features[0];
      const id = f.id;
      
      if (id === undefined || id === null) return;

      // Clear previous selection
      if (selectedId !== null && selectedId !== undefined) {
        map.current.setFeatureState({ source: 'hk', id: selectedId }, { selected: false });
      }
      
      selectedId = id;
      map.current.setFeatureState({ source: 'hk', id: selectedId }, { selected: true });
      map.current.setPaintProperty('outside-mask-fill', 'fill-opacity', 0.1);

      const props = f.properties || {};
      const district = props['District'] || props['DISTRICT'] || props['name'] || 'Unknown district';
      
      // Update selected district to filter the side panel
      setSelectedDistrict(district);

      const bbox = window.turf.bbox(f);
      map.current.fitBounds(bbox, { padding: 50, duration: 1000 });
    });

    map.current.on('click', (e: any) => {
      const features = map.current.queryRenderedFeatures(e.point, { layers: ['hk-fill'] });
      
      if (features.length === 0 && selectedDistrict) {
        clearSelection();
      }
    });
  };

  const clearSelection = () => {
    setSelectedDistrict(null);
    
    if (map.current) {
      const features = map.current.querySourceFeatures('hk');
      
      features.forEach((feature: any) => {
        if (map.current.getFeatureState({ source: 'hk', id: feature.id }).selected) {
          map.current.setFeatureState(
            { source: 'hk', id: feature.id }, 
            { selected: false }
          );
        }
      });
      
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div 
          ref={mapContainer} 
          className="w-full h-[500px] rounded-lg border border-border shadow-soft"
        />
      </div>
      <div className="md:col-span-1">
        <SidePanel
          selectedDistrict={selectedDistrict}
          stories={impactStories}
          projects={donationProjects}
          onClearSelection={clearSelection}
        />
      </div>
    </div>
  );
};

export default HongKongMap;