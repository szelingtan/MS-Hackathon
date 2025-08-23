import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Award,
    Crown,
    Flower,
    MapPin,
    Medal,
    Quote,
    Sprout,
    Star,
    TreePine,
    Trophy,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for districts and their plants
const districts = [
    {
        id: "district-1",
        name: "District 1 - Sunnydale Elementary",
        color: "text-plant-growth",
        donors: [
            { id: 1, name: "Sarah Johnson", plantLevel: 3, plantType: "Flowering Tree", votes: 24, totalDonated: 450 },
            { id: 2, name: "Mike Chen", plantLevel: 2, plantType: "Young Sprout", votes: 18, totalDonated: 320 },
            { id: 3, name: "Emma Wilson", plantLevel: 3, plantType: "Blooming Rose", votes: 31, totalDonated: 678 }
        ]
    },
    {
        id: "district-2",
        name: "District 2 - Riverside Community",
        color: "text-water",
        donors: [
            { id: 4, name: "David Brown", plantLevel: 1, plantType: "Tiny Seedling", votes: 12, totalDonated: 234 },
            { id: 5, name: "Lisa Garcia", plantLevel: 3, plantType: "Oak Sapling", votes: 28, totalDonated: 892 },
            { id: 6, name: "James Wilson", plantLevel: 2, plantType: "Pine Tree", votes: 22, totalDonated: 567 }
        ]
    },
    {
        id: "district-3",
        name: "District 3 - Green Valley",
        color: "text-earth",
        donors: [
            { id: 7, name: "Maria Rodriguez", plantLevel: 2, plantType: "Bamboo Grove", votes: 19, totalDonated: 445 },
            { id: 8, name: "John Kim", plantLevel: 1, plantType: "Herb Garden", votes: 15, totalDonated: 278 },
            { id: 9, name: "Anna Chen", plantLevel: 3, plantType: "Cherry Blossom", votes: 26, totalDonated: 623 }
        ]
    }
];

// Mock user data
const userData = {
    id: 1,
    name: "Sarah Johnson",
    totalDonated: 450,
    rank: 3,
    district: "district-1"
};

// Motivational quotes
const quotes = [
    "Every donation plants a seed of hope in a child's future.",
    "Together, we grow stronger communities one student at a time.",
    "Your kindness today becomes tomorrow's success story.",
    "Small acts of generosity create lasting change.",
    "Education is the most powerful weapon to change the world."
];

const Leaderboard = () => {
    const [selectedTab, setSelectedTab] = useState("voting");
    const [votedPlants, setVotedPlants] = useState(new Set());
    const [currentQuote, setCurrentQuote] = useState(quotes[0]);
    const [hasVotedToday, setHasVotedToday] = useState(false);

    // Rotate quotes every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Get all donors for overall leaderboard
    const allDonors = districts.flatMap(district =>
        district.donors.map(donor => ({
            ...donor,
            district: district.name,
            districtColor: district.color
        }))
    ).sort((a, b) => b.totalDonated - a.totalDonated);

    const topDonors = allDonors.sort((a, b) => b.votes - a.votes);

    const handleVote = (donorId, districtId) => {
        if (!votedPlants.has(districtId)) {
            setVotedPlants(new Set([...votedPlants, districtId]));

            // Check if voted for all districts
            if (votedPlants.size === 2) { // Will be 3 after this vote
                setHasVotedToday(true);
            }
        }
    };

    const getPlantIcon = (level) => {
        switch (level) {
            case 1: return Sprout;
            case 2: return TreePine;
            case 3: return Flower;
            default: return Sprout;
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
            case 2: return <Medal className="h-6 w-6 text-gray-400" />;
            case 3: return <Award className="h-6 w-6 text-yellow-600" />;
            default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Motivational Quote of the Day */}
            <Card className="shadow-soft bg-gradient-to-r from-plant-base/10 to-plant-growth/10 border-plant-base/20">
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                        <Quote className="h-8 w-8 text-plant-growth" />
                        <div>
                            <p className="text-lg font-medium text-foreground italic">"{currentQuote}"</p>
                            <p className="text-sm text-muted-foreground mt-1">Quote of the Day</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="voting" className="flex items-center gap-2">
                        <Sprout className="h-4 w-4" />
                        Daily Voting
                    </TabsTrigger>
                    <TabsTrigger value="overall" className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Overall
                    </TabsTrigger>
                    <TabsTrigger value="districts" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        By District
                    </TabsTrigger>
                </TabsList>

                {/* Daily Plant Voting */}
                <TabsContent value="voting" className="space-y-6">
                    <Card className="shadow-plant">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sprout className="h-6 w-6 text-plant-growth" />
                                Daily Plant Competition
                            </CardTitle>
                            <CardDescription>
                                Vote for the most beautiful plant in each district! You can vote once per district daily.
                            </CardDescription>
                            {hasVotedToday && (
                                <Badge className="bg-plant-growth/20 text-plant-growth border-plant-growth/30 w-fit">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Voting Complete! +50 water drops earned
                                </Badge>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {districts.map((district) => (
                                <Card key={district.id} className="shadow-soft">
                                    <CardHeader>
                                        <CardTitle className={`text-lg ${district.color}`}>
                                            {district.name}
                                        </CardTitle>
                                        {votedPlants.has(district.id) && (
                                            <Badge variant="outline" className="w-fit">
                                                ✓ Voted
                                            </Badge>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-4">
                                            {district.donors.map((donor) => {
                                                const PlantIcon = getPlantIcon(donor.plantLevel);
                                                return (
                                                    <div key={donor.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex flex-col items-center">
                                                                <PlantIcon className={`h-8 w-8 ${district.color}`} />
                                                                <span className="text-xs text-muted-foreground mt-1">
                                                                    Level {donor.plantLevel}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{donor.name}</p>
                                                                <p className="text-sm text-muted-foreground">{donor.plantType}</p>
                                                                <p className="text-xs text-muted-foreground">{donor.votes} votes today</p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant={votedPlants.has(district.id) ? "outline" : "nature"}
                                                            size="sm"
                                                            disabled={votedPlants.has(district.id)}
                                                            onClick={() => handleVote(donor.id, district.id)}
                                                        >
                                                            {votedPlants.has(district.id) ? "Voted" : "Vote"}
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Overall Leaderboard */}
                <TabsContent value="overall" className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Top Donors by Amount */}
                        <Card className="shadow-plant">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-6 w-6 text-accent" />
                                    Top Donors by Amount
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {allDonors.slice(0, 5).map((donor, index) => (
                                    <div key={donor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-8 h-8">
                                                {getRankIcon(index + 1)}
                                            </div>
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${donor.name}`} />
                                                <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{donor.name}</p>
                                                <p className={`text-sm ${donor.districtColor}`}>{donor.district}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-plant-growth">${donor.totalDonated}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Most Popular Garden */}
                        <Card className="shadow-plant">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-6 w-6 text-accent" />
                                    Most Popular Garden
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {topDonors.slice(0, 5).map((donor, index) => {
                                    const PlantIcon = getPlantIcon(donor.plantLevel);
                                    return (
                                        <div key={donor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center justify-center w-8 h-8">
                                                    {getRankIcon(index + 1)}
                                                </div>
                                                <PlantIcon className={`h-8 w-8 ${donor.districtColor}`} />
                                                <div>
                                                    <p className="font-medium">{donor.name}</p>
                                                    <p className="text-sm text-muted-foreground">{donor.district}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-accent">{donor.votes} votes</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Your Current Standing */}
                    <Card className="shadow-soft bg-gradient-water/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Medal className="h-6 w-6 text-water" />
                                Your Current Standing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Donation Standing */}
                                <div className="flex items-center space-x-4 p-4 bg-plant-growth/10 rounded-lg">
                                    <div className="flex items-center justify-center w-12 h-12 bg-plant-growth/20 rounded-full">
                                        <span className="text-xl font-bold text-plant-growth">#{userData.rank}</span>
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold">{userData.name}</p>
                                        <p className="text-sm text-muted-foreground">Amount Donated</p>
                                        <p className="font-bold text-plant-growth">${userData.totalDonated}</p>
                                    </div>
                                </div>
                                
                                {/* Garden Votes Standing */}
                                <div className="flex items-center space-x-4 p-4 bg-accent/10 rounded-lg">
                                    <div className="flex items-center justify-center w-12 h-12 bg-accent/20 rounded-full">
                                        <span className="text-xl font-bold text-accent">#4</span>
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold">{userData.name}</p>
                                        <p className="text-sm text-muted-foreground">Garden Votes</p>
                                        <p className="font-bold text-accent">24 votes</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-center mt-4 text-sm text-muted-foreground">
                                <p>Visit your profile to view badges and achievements!</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* District Leaderboards */}
                <TabsContent value="districts" className="space-y-6">
                    <div className="grid gap-6">
                        {districts.map((district) => (
                            <Card key={district.id} className="shadow-soft">
                                <CardHeader>
                                    <CardTitle className={`flex items-center gap-2 ${district.color}`}>
                                        <MapPin className="h-6 w-6" />
                                        {district.name}
                                    </CardTitle>
                                    <CardDescription>
                                        Top performers in this district
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {district.donors
                                            .sort((a, b) => b.totalDonated - a.totalDonated)
                                            .map((donor, index) => {
                                                const PlantIcon = getPlantIcon(donor.plantLevel);
                                                return (
                                                    <div key={donor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex items-center justify-center w-8 h-8">
                                                                {getRankIcon(index + 1)}
                                                            </div>
                                                            <PlantIcon className={`h-6 w-6 ${district.color}`} />
                                                            <div>
                                                                <p className="font-medium">{donor.name}</p>
                                                                <p className="text-sm text-muted-foreground">{donor.plantType}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-plant-growth">${donor.totalDonated}</p>
                                                            <p className="text-sm text-muted-foreground">{donor.votes} votes</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Leaderboard;