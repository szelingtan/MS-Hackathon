import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Heart, Users, MapPin, DollarSign, Clock, Target } from "lucide-react";

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

interface PopupProps {
  district: string;
  stories: ImpactStory[];
  projects: DonationProject[];
  onClose: () => void;
}

const DistrictPopup: React.FC<PopupProps> = ({ district, stories, projects, onClose }) => {
  const districtStories = stories.filter(story => story.district === district);
  const districtProjects = projects.filter(project => project.district === district);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" />
            <CardTitle>{district}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[70vh]">
          <Tabs defaultValue="stories" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stories" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Impact Stories ({districtStories.length})
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Donation Projects ({districtProjects.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stories" className="mt-4">
              {districtStories.length > 0 ? (
                <div className="space-y-4">
                  {districtStories.map((story) => (
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
                    No impact stories available for {district} yet. Be the first to make a difference!
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects" className="mt-4">
              {districtProjects.length > 0 ? (
                <div className="space-y-4">
                  {districtProjects.map((project) => {
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
                              <div className="flex items-center gap-4">
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
                              <Button size="sm" variant="nature">
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
                    No donation projects available for {district} at the moment.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const HongKongMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [impactStories, setImpactStories] = useState<ImpactStory[]>([]);
  const [donationProjects, setDonationProjects] = useState<DonationProject[]>([]);

  useEffect(() => {
    // Load impact stories and donation projects
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
        // Set fallback data or empty arrays
        setImpactStories([]);
        setDonationProjects([]);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    // Load MapLibre GL and Turf.js scripts dynamically
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

      initializeMap();
    };

    const initializeMap = async () => {
      if (!mapContainer.current) return;

      map.current = new window.maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [114.1694, 22.3193],
        zoom: 9.6,
        pitch: 50,
        bearing: -10,
        antialias: true
      });

      map.current.addControl(new window.maplibregl.NavigationControl());

      map.current.on('load', async () => {
        // Load Hong Kong districts data
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

          // Add 3D extrusion layer
          map.current.addLayer({
            id: 'hk-extrude',
            type: 'fill-extrusion',
            source: 'hk',
            filter: ['==', ['id'], -1],
            paint: {
              'fill-extrusion-color': '#ffcc00',
              'fill-extrusion-height': 1200,
              'fill-extrusion-base': 0,
              'fill-extrusion-opacity': 0.9
            }
          });

          // Add interaction handlers
          let hoveredId: any = null;
          let selectedId: any = null;

          const updateMaskBrightness = (isRegionSelected: boolean) => {
            map.current.setPaintProperty('outside-mask-fill', 'fill-opacity', isRegionSelected ? 0.1 : 0.3);
          };

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
            map.current.setFilter('hk-extrude', ['==', ['id'], selectedId]);
            updateMaskBrightness(true);

            const props = f.properties || {};
            const district = props['District'] || props['DISTRICT'] || props['name'] || 'Unknown district';
            
            // Show popup with impact stories and donation projects
            setSelectedDistrict(district);

            const bbox = window.turf.bbox(f);
            map.current.fitBounds(bbox, { padding: 50, duration: 1000 });
          });

          // Add general map click handler to close popup when clicking outside districts
          map.current.on('click', (e: any) => {
            // Check if the click was on a district
            const features = map.current.queryRenderedFeatures(e.point, { layers: ['hk-fill'] });
            
            // If no district features were clicked, close the popup
            if (features.length === 0 && selectedDistrict) {
              setSelectedDistrict(null);
              
              // Clear selection on map
              if (selectedId !== null && selectedId !== undefined) {
                map.current.setFeatureState({ source: 'hk', id: selectedId }, { selected: false });
                selectedId = null;
              }
              map.current.setFilter('hk-extrude', ['==', ['id'], -1]);
              updateMaskBrightness(false);
            }
          });

        } catch (error) {
          console.error('Error loading Hong Kong data:', error);
        }
      });
    };

    loadScripts();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const handleClosePopup = () => {
    setSelectedDistrict(null);
    // Clear selection on map
    if (map.current) {
      map.current.setFilter('hk-extrude', ['==', ['id'], -1]);
      map.current.setPaintProperty('outside-mask-fill', 'fill-opacity', 0.3);
    }
  };

  return (
    <div className="relative">
      <div 
        ref={mapContainer} 
        className="w-full h-[500px] rounded-lg border border-border shadow-soft"
      />
      {selectedDistrict && (
        <DistrictPopup 
          district={selectedDistrict}
          stories={impactStories}
          projects={donationProjects}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default HongKongMap;