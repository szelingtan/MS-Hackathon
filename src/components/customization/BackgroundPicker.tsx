import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackgroundTheme } from '@/types/themes';
import { Palette, Lock, Check } from 'lucide-react';

interface BackgroundPickerProps {
  currentTheme: string;
  waterDrops: number;
  themes: BackgroundTheme[];
  onThemeSelect: (themeId: string) => void;
  onThemePurchase: (themeId: string, cost: number) => void;
}

export const BackgroundPicker = ({
  currentTheme,
  waterDrops,
  themes,
  onThemeSelect,
  onThemePurchase
}: BackgroundPickerProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('time');

  const categories = [
    { id: 'time', name: '🌅 Time', description: 'Day & night cycles' },
    { id: 'weather', name: '🌧️ Weather', description: 'Rain, snow & more' },
    { id: 'season', name: '🍂 Seasons', description: 'Spring, autumn vibes' },
    { id: 'environment', name: '🏖️ Places', description: 'Desert, ocean & more' },
    { id: 'special', name: '✨ Special', description: 'Magical themes' },
  ];

  const ThemeCard = ({ theme }: { theme: BackgroundTheme }) => {
    const isSelected = currentTheme === theme.id;
    const canAfford = waterDrops >= theme.cost;
    const isOwned = theme.owned;

    return (
      <div
        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
          isSelected
            ? 'border-plant-growth bg-plant-growth/10'
            : 'border-border hover:border-accent/50'
        }`}
        onClick={() => {
          if (isOwned) {
            onThemeSelect(theme.id);
          } else if (canAfford) {
            onThemePurchase(theme.id, theme.cost);
          }
        }}
      >
        {/* Preview */}
        <div className={`w-full h-24 rounded-md mb-3 ${theme.sky.gradient} relative overflow-hidden`}>
          {/* Sky Elements Preview */}
          {theme.sky.elements.slice(0, 2).map((element, idx) => (
            <div
              key={element.id}
              className={`absolute ${element.position.x} ${element.position.y} ${element.size}`}
              style={{ opacity: element.opacity || 1 }}
            >
              {element.emoji}
            </div>
          ))}
          
          {/* Ground Preview */}
          <div className={`absolute bottom-0 left-0 right-0 h-2 ${theme.ground.gradient}`} />
          
          {/* Selected Indicator */}
          {isSelected && (
            <div className="absolute inset-0 bg-plant-growth/20 flex items-center justify-center">
              <div className="bg-plant-growth text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>

        {/* Theme Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">{theme.name}</h4>
            {!isOwned && (
              <Badge variant={canAfford ? "outline" : "destructive"} className="text-xs">
                {theme.cost}💧
              </Badge>
            )}
            {isOwned && <Badge className="bg-plant-growth text-white text-xs">Owned</Badge>}
          </div>
          
          <p className="text-xs text-muted-foreground">{theme.description}</p>
          
          {/* Action Button */}
          {!isOwned && (
            <Button
              size="sm"
              variant={canAfford ? "nature" : "outline"}
              disabled={!canAfford}
              className="w-full text-xs"
              onClick={(e) => {
                e.stopPropagation();
                if (canAfford) {
                  onThemePurchase(theme.id, theme.cost);
                }
              }}
            >
              {canAfford ? (
                <>Buy {theme.cost}💧</>
              ) : (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Need {theme.cost - waterDrops} more
                </>
              )}
            </Button>
          )}
          
          {isOwned && !isSelected && (
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onThemeSelect(theme.id);
              }}
            >
              Select Theme
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-accent" />
          Background Themes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-xs flex flex-col items-center p-2"
              >
                <div>{category.name.split(' ')[0]}</div>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {themes.filter(theme => theme.category === category.id).map((theme) => (
                  <ThemeCard key={theme.id} theme={theme} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};