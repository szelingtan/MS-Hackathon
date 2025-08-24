import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import donorsData from "@/data/donors.json";
import { useAuth } from "@/hooks/use-auth";
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
import { useEffect, useMemo, useState } from "react";

// Group donors by region and create district structure
const createDistricts = (donors) => {
    const regionGroups = donors.reduce((acc, donor) => {
        const region = donor.region || "Unknown Region";
        if (!acc[region]) {
            acc[region] = [];
        }
        acc[region].push({
            id: donor.id,
            name: donor.name,
            plantLevel: donor.plantLevel || 1,
            plantType: donor.plantType || "Unknown Plant",
            votes: donor.votes || 0,
            totalDonated: donor.totalDonated || 0
        });
        return acc;
    }, {});

    // Convert to districts array with colors
    const colors = ["text-plant-growth", "text-water", "text-earth", "text-accent"];
    return Object.entries(regionGroups).map(([region, donors], index) => ({
        id: `district-${index + 1}`,
        name: `${region}`,
        color: colors[index % colors.length],
        donors: donors
    }));
};

const districtMap = {
  1: "Hong Kong Island",
  2: "Kowloon",
  3: "New Territories",
  4: "Outlying Islands"
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
    const [votedDonors, setVotedDonors] = useState(new Set());
    const [currentQuote, setCurrentQuote] = useState(quotes[0]);
    const [districts, setDistricts] = useState([]);
    const { user } = useAuth();

    // Initialize districts from JSON data
    useEffect(() => {
        const districtData = createDistricts(donorsData);
        setDistricts(districtData);
    }, []);

    // Rotate quotes every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Create user data object with current user info
    const userData = {
        id: user?.user_id || 'current-user',
        name: user?.name || "Guest",
        totalDonated: user?.donated_amount || 0,
        district: districtMap[user?.district_id as keyof typeof districtMap] || "Unknown District"
    };

    // Get all donors for overall leaderboard and include current user
    const allDonorsWithUser = useMemo(() => {
        const donorsFromData = districts.flatMap(district =>
            district.donors.map(donor => ({
                ...donor,
                district: district.name,
                districtColor: district.color,
                isCurrentUser: false
            }))
        );

        // Add current user to the list if they have donations
        if (userData.totalDonated > 0) {
            donorsFromData.push({
                ...userData,
                plantLevel: 2, // Default plant level for user
                plantType: "Your Garden",
                votes: 0,
                districtColor: "text-plant-growth",
                isCurrentUser: true
            });
        }

        // Sort by donation amount
        return donorsFromData.sort((a, b) => b.totalDonated - a.totalDonated);
    }, [districts, userData]);

    // Find user's rank in the leaderboard
    const userRank = useMemo(() => {
        const userIndex = allDonorsWithUser.findIndex(donor => donor.isCurrentUser);
        return userIndex !== -1 ? userIndex + 1 : null;
    }, [allDonorsWithUser]);

    // Check if user should be in top 5
    const userInTop5 = userRank && userRank <= 5;

    // Get display list for top donors - either top 5 or top 4 + user
    const topDonorsDisplay = useMemo(() => {
        if (userInTop5) {
            // User is in top 5, show normal top 5
            return allDonorsWithUser.slice(0, 5);
        } else if (userRank) {
            // User is not in top 5, show top 4 + user
            const top4 = allDonorsWithUser.slice(0, 4);
            const currentUser = allDonorsWithUser.find(donor => donor.isCurrentUser);
            return currentUser ? [...top4, currentUser] : top4;
        } else {
            // User has no donations, show normal top 5
            return allDonorsWithUser.slice(0, 5);
        }
    }, [allDonorsWithUser, userInTop5, userRank]);

    const topDonors = allDonorsWithUser.sort((a, b) => b.votes - a.votes);

    const handleVote = (donorId) => {
        if (!votedDonors.has(donorId)) {
            setVotedDonors(new Set([...votedDonors, donorId]));
        }
    };

    // Check if user has voted for anyone in a district
    const hasVotedInDistrict = (district) => {
        return district.donors.some(donor => votedDonors.has(donor.id));
    };

    // Check if user has voted for all districts
    const hasVotedInAllDistricts = () => {
        return districts.every(district => hasVotedInDistrict(district));
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

    // Get the display rank for each donor in the top donors display
    const getDisplayRank = (donor, index) => {
        if (donor.isCurrentUser && !userInTop5) {
            return userRank; // Show actual rank for user when not in top 5
        }
        return index + 1; // Show position in top 5 list
    };

    // Show loading state while districts are being created
    if (districts.length === 0) {
        return (
            <div className="space-y-6">
                <Card className="shadow-soft">
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Loading leaderboard...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                        Daily Garden Voting
                    </TabsTrigger>
                    <TabsTrigger value="districts" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        District Leaderboard
                    </TabsTrigger>
                    <TabsTrigger value="overall" className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Overall Leaderboard
                    </TabsTrigger>
                </TabsList>

                {/* Daily Garden Competition */}
                <TabsContent value="voting" className="space-y-6">
                    <Card className="shadow-plant">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sprout className="h-6 w-6 text-plant-growth" />
                                Daily Garden Competition
                            </CardTitle>
                            <CardDescription>
                                Vote for your favorite gardens in each district! You can vote for multiple gardens.
                            </CardDescription>
                            {hasVotedInAllDistricts() && (
                                <Badge className="bg-plant-growth/20 text-plant-growth border-plant-growth/30 w-fit">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Voted in all districts! +50 water drops earned
                                </Badge>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {districts.map((district) => (
                                <Card key={district.id} className="shadow-soft">
                                    <CardHeader>
                                        <CardTitle className={`text-lg ${district.color} flex items-center justify-between`}>
                                            <span>{district.name}</span>
                                            {hasVotedInDistrict(district) && (
                                                <Badge variant="outline" className="text-green-600 border-green-300">
                                                    ✓ Voted in district
                                                </Badge>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-4">
                                            {district.donors.map((donor) => {
                                                const PlantIcon = getPlantIcon(donor.plantLevel);
                                                const hasVotedForThis = votedDonors.has(donor.id);
                                                const hasVotedInThisDistrict = hasVotedInDistrict(district);

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

                                                        {/* Updated vote button with different states */}
                                                        {hasVotedForThis ? (
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                disabled
                                                                className="bg-green-500 hover:bg-green-500 text-white"
                                                            >
                                                                ✓ Voted
                                                            </Button>
                                                        ) : hasVotedInThisDistrict ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleVote(donor.id)}
                                                                className="border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
                                                                disabled={true}
                                                            >
                                                                Vote
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="nature"
                                                                size="sm"
                                                                onClick={() => handleVote(donor.id)}
                                                            >
                                                                Vote
                                                            </Button>
                                                        )}
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
                                {!userInTop5 && userRank && (
                                    <CardDescription>
                                        Showing top 4 donors and your position (#{userRank})
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {topDonorsDisplay.map((donor, index) => {
                                    const displayRank = getDisplayRank(donor, index);
                                    const isCurrentUser = donor.isCurrentUser;
                                    
                                    return (
                                        <div 
                                            key={donor.id} 
                                            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                                                isCurrentUser 
                                                    ? 'bg-gradient-to-r from-blue-100 to-green-100 border-2 border-plant-growth shadow-md' 
                                                    : 'bg-muted/30'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center justify-center w-8 h-8">
                                                    {getRankIcon(displayRank)}
                                                </div>
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${donor.name}`} />
                                                    <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className={`font-medium ${isCurrentUser ? 'text-plant-growth' : ''}`}>
                                                        {donor.name}
                                                        {isCurrentUser && <span className="text-sm font-normal text-muted-foreground ml-2">(You)</span>}
                                                    </p>
                                                    <p className={`text-sm ${donor.districtColor}`}>{donor.district}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold ${isCurrentUser ? 'text-plant-growth text-lg' : 'text-plant-growth'}`}>
                                                    ${donor.totalDonated}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                {/* Show gap indicator when user is not in top 5 */}
                                {!userInTop5 && userRank && userRank > 5 && (
                                    <div className="text-center py-2 text-sm text-muted-foreground border-t border-dashed">
                                        ... {userRank - 5} other donors ...
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Most Popular Gardens by Month */}
                        <Card className="shadow-plant">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-6 w-6 text-accent" />
                                    Most Popular Gardens by Month
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
                                                <p className="font-bold text-accent">{donor.votes * 30} votes</p>
                                                <p className="text-xs text-muted-foreground">this month</p>
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
                                        <span className="text-xl font-bold text-plant-growth">
                                            {userRank ? `#${userRank}` : 'N/A'}
                                        </span>
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
                                        Top donors in this district
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {district.donors
                                            .sort((a, b) => b.totalDonated - a.totalDonated)
                                            .map((donor, index) => (
                                                <div key={donor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex items-center justify-center w-8 h-8">
                                                            {getRankIcon(index + 1)}
                                                        </div>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${donor.name}`} />
                                                            <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">{donor.name}</p>
                                                            <p className="text-sm text-muted-foreground">Donor</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-plant-growth">${donor.totalDonated}</p>
                                                        <p className="text-sm text-muted-foreground">donated</p>
                                                    </div>
                                                </div>
                                            ))}
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