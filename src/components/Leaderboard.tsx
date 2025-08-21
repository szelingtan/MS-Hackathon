import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Award,
    Crown,
    Flower,
    Gift,
    Heart,
    MapPin,
    Medal,
    Quote,
    Sprout,
    Star,
    Target,
    TreePine,
    Trophy,
    Users,
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

// Mock badges data
const badges = [
    { id: "early-supporter", name: "Early Supporter", icon: Star, color: "text-accent", description: "One of the first 100 donors" },
    { id: "team-champion", name: "Team Champion", icon: Users, color: "text-plant-growth", description: "Recruited 5+ donors" },
    { id: "100-lives", name: "100 Lives Touched", icon: Heart, color: "text-destructive", description: "Impacted 100+ students" },
    { id: "plant-master", name: "Plant Master", icon: TreePine, color: "text-plant-base", description: "Reached max plant level" },
    { id: "generous-giver", name: "Generous Giver", icon: Gift, color: "text-earth", description: "Donated $1000+" },
    { id: "consistent-supporter", name: "Consistent Supporter", icon: Target, color: "text-water", description: "Donated 3 months in a row" }
];

// Mock user data with badges
const userData = {
    id: 1,
    name: "Sarah Johnson",
    totalDonated: 450,
    rank: 3,
    badges: ["early-supporter", "team-champion", "100-lives"],
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
                <TabsList className="grid w-full grid-cols-4">
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
                    <TabsTrigger value="badges" className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Badges
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

                        {/* Most Popular Plants */}
                        <Card className="shadow-plant">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-6 w-6 text-accent" />
                                    Most Popular Plants
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
                                                    <p className="font-medium">{donor.plantType}</p>
                                                    <p className="text-sm text-muted-foreground">{donor.name}</p>
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

                    {/* Your Current Rank */}
                    <Card className="shadow-soft bg-gradient-water/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Medal className="h-6 w-6 text-water" />
                                Your Current Standing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-water/20 rounded-full">
                                        <span className="text-xl font-bold text-water">#{userData.rank}</span>
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold">{userData.name}</p>
                                        <p className="text-muted-foreground">${userData.totalDonated} donated</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {userData.badges.slice(0, 3).map((badgeId) => {
                                        const badge = badges.find(b => b.id === badgeId);
                                        if (!badge) return null;
                                        const IconComponent = badge.icon;
                                        return (
                                            <div key={badgeId} className={`p-2 rounded-full bg-muted/50`}>
                                                <IconComponent className={`h-4 w-4 ${badge.color}`} />
                                            </div>
                                        );
                                    })}
                                </div>
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

                {/* Badges & Achievements */}
                <TabsContent value="badges" className="space-y-6">
                    {/* Your Badges */}
                    <Card className="shadow-plant">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-6 w-6 text-accent" />
                                Your Achievements
                            </CardTitle>
                            <CardDescription>
                                Badges you've earned for your contributions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {badges.map((badge) => {
                                    const IconComponent = badge.icon;
                                    const isEarned = userData.badges.includes(badge.id);
                                    return (
                                        <div
                                            key={badge.id}
                                            className={`p-4 rounded-lg border transition-all ${isEarned
                                                    ? 'bg-gradient-to-br from-plant-base/20 to-plant-growth/20 border-plant-base/30 shadow-plant'
                                                    : 'bg-muted/30 border-muted opacity-60'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center text-center space-y-2">
                                                <div className={`p-3 rounded-full ${isEarned ? 'bg-plant-growth/20' : 'bg-muted'}`}>
                                                    <IconComponent className={`h-6 w-6 ${isEarned ? badge.color : 'text-muted-foreground'}`} />
                                                </div>
                                                <div>
                                                    <p className={`font-semibold ${isEarned ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                        {badge.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {badge.description}
                                                    </p>
                                                </div>
                                                {isEarned && (
                                                    <Badge className="bg-plant-growth/20 text-plant-growth border-plant-growth/30">
                                                        Earned!
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Progress Towards Next Badge */}
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-6 w-6 text-water" />
                                Progress Towards Next Badge
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Generous Giver ($1000 donated)</span>
                                    <span className="text-sm text-muted-foreground">$450 / $1000</span>
                                </div>
                                <Progress value={45} className="h-2" />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Plant Master (Max plant level)</span>
                                    <span className="text-sm text-muted-foreground">Level 3 / 3</span>
                                </div>
                                <Progress value={100} className="h-2" />
                                <Badge className="bg-plant-growth/20 text-plant-growth border-plant-growth/30">
                                    Ready to claim!
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Leaderboard;