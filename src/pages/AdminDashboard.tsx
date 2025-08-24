import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Users, DollarSign, TrendingUp, Heart, UserPlus, Repeat, Share2, Target,
  MapPin, MessageCircle, Shield, LogOut, LayoutGrid, Activity, PieChart as PieIcon, Layers,
  LucideIcon,
  Book, Milestone
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import ImpactStoryFeed from '@/components/ImpactStoryFeed';
import treeLogo from "@/assets/tree.png";
import reachTogetherLogo from "@/assets/reachTogether.png";
import ProjectsList from"@/components/ProjectList";
import mockDonorsData from '@/data/donors.json';

type TimeRangeKey = '3months' | '6months' | '1year';
type NavTab =
  | 'overview'
  | 'donationTrends'
  | 'donorGrowth'
  | 'statusDistribution'
  | 'districts'
  | 'socialEngagement'
  | 'impact'
  | 'impactStories'
  | 'milestones';

  const RECENT_DONOR_COUNT = 10;
  interface Donor {
  id: number;
  name: string;
  email: string;
  totalDonated: number;
  lastDonation: string;
  status: string;
  region: string;
  plantLevel: number;
  plantType: string;
  votes: number;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('6months');
  const [navTab, setNavTab] = useState<NavTab>('overview');

  // Load mock donors from JSON file
  const mockDonors: Donor[] = mockDonorsData;

  // Hong Kong districts mapping
  const hkDistricts = [
    "Central & Western", "Wan Chai", "Eastern", "Southern", "Kowloon City",
    "Kwun Tong", "Sham Shui Po", "Wong Tai Sin", "Yau Tsim Mong", "Islands",
    "Kwai Tsing", "North", "Sai Kung", "Sha Tin", "Tai Po", "Tsuen Wan",
    "Tuen Mun", "Yuen Long"
  ];

  // --- Metrics derived from donor data ---
  const totalDonors = mockDonors.length;
  const totalRaised = mockDonors.reduce((sum, d) => sum + d.totalDonated, 0);
  const activeDonors = mockDonors.filter(d => d.status === "Active").length;
  const premiumDonors = mockDonors.filter(d => d.status === "Premium").length;

  // --- Time-series data ---
  const dataByPeriod: Record<TimeRangeKey, {
    donations: Array<{ date: string; amount: number; count: number }>;
    growth: Array<{ date: string; users: number; growth: number }>;
    status: Array<{ name: string; value: number; color: string }>;
    monthly: Array<{ 
      month: string; 
      donors: number; 
      amount: number; 
      newDonors: number; 
      retention: number;
      date?: string;
      count?: number;
      users?: number;
      growth?: number;
    }>;
    totalDonors: number;
    totalRaised: number;
    retention: number;
    socialReach: number;
    trends: {
      donors: number;
      amount: number;
      retention: number;
      social: number;
    };
  }> = {
    '3months': {
      donations: [
        { date: 'Jun', amount: Math.floor(totalRaised * 0.3), count: Math.floor(totalDonors * 0.6) },
        { date: 'Jul', amount: Math.floor(totalRaised * 0.6), count: Math.floor(totalDonors * 0.8) },
        { date: 'Aug', amount: totalRaised, count: totalDonors }
      ],
      growth: [
        { date: 'Jun', users: Math.floor(totalDonors * 0.6), growth: 15.2 },
        { date: 'Jul', users: Math.floor(totalDonors * 0.8), growth: 20.8 },
        { date: 'Aug', users: totalDonors, growth: 25.0 }
      ],
      status: [
        { name: 'Active', value: 68, color: '#10B981' },
        { name: 'Pending', value: 22, color: '#F59E0B' },
        { name: 'Completed', value: 10, color: '#6366F1' }
      ],
      monthly: [
        { month: 'Jun', donors: Math.floor(totalDonors * 0.6), amount: Math.floor(totalRaised * 0.3), newDonors: 3, retention: 85 },
        { month: 'Jul', donors: Math.floor(totalDonors * 0.8), amount: Math.floor(totalRaised * 0.6), newDonors: 4, retention: 88 },
        { month: 'Aug', donors: totalDonors, amount: totalRaised, newDonors: 5, retention: 92 }
      ],
      totalDonors, totalRaised, retention: 92, socialReach: 1200,
      trends: { donors: 15.2, amount: 28.5, retention: 4.1, social: 18.7 }
    },
    '6months': {
      donations: [
        { date: 'Mar', amount: Math.floor(totalRaised * 0.15), count: Math.floor(totalDonors * 0.25) },
        { date: 'Apr', amount: Math.floor(totalRaised * 0.25), count: Math.floor(totalDonors * 0.35) },
        { date: 'May', amount: Math.floor(totalRaised * 0.4), count: Math.floor(totalDonors * 0.5) },
        { date: 'Jun', amount: Math.floor(totalRaised * 0.55), count: Math.floor(totalDonors * 0.65) },
        { date: 'Jul', amount: Math.floor(totalRaised * 0.75), count: Math.floor(totalDonors * 0.8) },
        { date: 'Aug', amount: totalRaised, count: totalDonors }
      ],
      growth: [
        { date: 'Mar', users: Math.floor(totalDonors * 0.25), growth: 5.0 },
        { date: 'Apr', users: Math.floor(totalDonors * 0.35), growth: 8.2 },
        { date: 'May', users: Math.floor(totalDonors * 0.5), growth: 12.5 },
        { date: 'Jun', users: Math.floor(totalDonors * 0.65), growth: 16.8 },
        { date: 'Jul', users: Math.floor(totalDonors * 0.8), growth: 20.8 },
        { date: 'Aug', users: totalDonors, growth: 25.0 }
      ],
      status: [
        { name: 'Active', value: 62, color: '#10B981' },
        { name: 'Pending', value: 28, color: '#F59E0B' },
        { name: 'Completed', value: 10, color: '#6366F1' }
      ],
      monthly: [
        { month: 'Mar', donors: Math.floor(totalDonors * 0.25), amount: Math.floor(totalRaised * 0.15), newDonors: 2, retention: 78 },
        { month: 'Apr', donors: Math.floor(totalDonors * 0.35), amount: Math.floor(totalRaised * 0.25), newDonors: 3, retention: 82 },
        { month: 'May', donors: Math.floor(totalDonors * 0.5), amount: Math.floor(totalRaised * 0.4), newDonors: 3, retention: 85 },
        { month: 'Jun', donors: Math.floor(totalDonors * 0.65), amount: Math.floor(totalRaised * 0.55), newDonors: 4, retention: 87 },
        { month: 'Jul', donors: Math.floor(totalDonors * 0.8), amount: Math.floor(totalRaised * 0.75), newDonors: 4, retention: 90 },
        { month: 'Aug', donors: totalDonors, amount: totalRaised, newDonors: 5, retention: 92 }
      ],
      totalDonors, totalRaised, retention: 92, socialReach: 2340,
      trends: { donors: 26.8, amount: 35.6, retention: 8.2, social: 34.5 }
    },
    '1year': {
      donations: [
        { date: 'Sep', amount: Math.floor(totalRaised * 0.05), count: Math.floor(totalDonors * 0.08) },
        { date: 'Oct', amount: Math.floor(totalRaised * 0.08), count: Math.floor(totalDonors * 0.12) },
        { date: 'Nov', amount: Math.floor(totalRaised * 0.12), count: Math.floor(totalDonors * 0.17) },
        { date: 'Dec', amount: Math.floor(totalRaised * 0.18), count: Math.floor(totalDonors * 0.22) },
        { date: 'Jan', amount: Math.floor(totalRaised * 0.25), count: Math.floor(totalDonors * 0.28) },
        { date: 'Feb', amount: Math.floor(totalRaised * 0.32), count: Math.floor(totalDonors * 0.35) },
        { date: 'Mar', amount: Math.floor(totalRaised * 0.38), count: Math.floor(totalDonors * 0.42) },
        { date: 'Apr', amount: Math.floor(totalRaised * 0.48), count: Math.floor(totalDonors * 0.55) },
        { date: 'May', amount: Math.floor(totalRaised * 0.62), count: Math.floor(totalDonors * 0.68) },
        { date: 'Jun', amount: Math.floor(totalRaised * 0.75), count: Math.floor(totalDonors * 0.78) },
        { date: 'Jul', amount: Math.floor(totalRaised * 0.87), count: Math.floor(totalDonors * 0.88) },
        { date: 'Aug', amount: totalRaised, count: totalDonors }
      ],
      growth: [
        { date: 'Sep', users: Math.floor(totalDonors * 0.08), growth: 2.0 },
        { date: 'Oct', users: Math.floor(totalDonors * 0.12), growth: 3.5 },
        { date: 'Nov', users: Math.floor(totalDonors * 0.17), growth: 5.2 },
        { date: 'Dec', users: Math.floor(totalDonors * 0.22), growth: 7.0 },
        { date: 'Jan', users: Math.floor(totalDonors * 0.28), growth: 9.1 },
        { date: 'Feb', users: Math.floor(totalDonors * 0.35), growth: 11.5 },
        { date: 'Mar', users: Math.floor(totalDonors * 0.42), growth: 14.2 },
        { date: 'Apr', users: Math.floor(totalDonors * 0.55), growth: 17.3 },
        { date: 'May', users: Math.floor(totalDonors * 0.68), growth: 20.7 },
        { date: 'Jun', users: Math.floor(totalDonors * 0.78), growth: 23.2 },
        { date: 'Jul', users: Math.floor(totalDonors * 0.88), growth: 24.5 },
        { date: 'Aug', users: totalDonors, growth: 25.0 }
      ],
      status: [
        { name: 'Active', value: 55, color: '#10B981' },
        { name: 'Pending', value: 32, color: '#F59E0B' },
        { name: 'Completed', value: 13, color: '#6366F1' }
      ],
      monthly: [
        { month: 'Sep', donors: Math.floor(totalDonors * 0.08), amount: Math.floor(totalRaised * 0.05), newDonors: 1, retention: 65 },
        { month: 'Oct', donors: Math.floor(totalDonors * 0.12), amount: Math.floor(totalRaised * 0.08), newDonors: 1, retention: 68 },
        { month: 'Nov', donors: Math.floor(totalDonors * 0.17), amount: Math.floor(totalRaised * 0.12), newDonors: 2, retention: 72 },
        { month: 'Dec', donors: Math.floor(totalDonors * 0.22), amount: Math.floor(totalRaised * 0.18), newDonors: 2, retention: 75 },
        { month: 'Jan', donors: Math.floor(totalDonors * 0.28), amount: Math.floor(totalRaised * 0.25), newDonors: 2, retention: 78 },
        { month: 'Feb', donors: Math.floor(totalDonors * 0.35), amount: Math.floor(totalRaised * 0.32), newDonors: 3, retention: 80 },
        { month: 'Mar', donors: Math.floor(totalDonors * 0.42), amount: Math.floor(totalRaised * 0.38), newDonors: 3, retention: 82 },
        { month: 'Apr', donors: Math.floor(totalDonors * 0.55), amount: Math.floor(totalRaised * 0.48), newDonors: 3, retention: 84 },
        { month: 'May', donors: Math.floor(totalDonors * 0.68), amount: Math.floor(totalRaised * 0.62), newDonors: 4, retention: 86 },
        { month: 'Jun', donors: Math.floor(totalDonors * 0.78), amount: Math.floor(totalRaised * 0.75), newDonors: 4, retention: 88 },
        { month: 'Jul', donors: Math.floor(totalDonors * 0.88), amount: Math.floor(totalRaised * 0.87), newDonors: 4, retention: 90 },
        { month: 'Aug', donors: totalDonors, amount: totalRaised, newDonors: 5, retention: 92 }
      ],
      totalDonors, totalRaised, retention: 92, socialReach: 4680,
      trends: { donors: 42.3, amount: 58.4, retention: 12.8, social: 48.7 }
    }
  };

  const currentData = dataByPeriod[timeRange];

  // --- Donor status ---
  const donorSegments = [
    { name: 'Active', value: activeDonors, color: '#8ab371' },
    { name: 'Premium', value: premiumDonors, color: '#fdba74' }
  ];

  // --- Social feed ---
  const socialFeedData = [
    { category: 'Impact Stories', posts: 28, views: 1420, likes: 156, shares: 42 },
    { category: 'Parent Updates', posts: 34, views: 1680, likes: 203, shares: 28 },
    { category: 'Organization News', posts: 15, views: 890, likes: 98, shares: 31 },
    { category: 'Volunteer Highlights', posts: 12, views: 640, likes: 87, shares: 19 }
  ];

  // --- Geographic data for Hong Kong districts ---
  const geographicData = useMemo(() => {
    // Group donors by district and calculate metrics
    const districtData = hkDistricts.map(district => {
      const districtDonors = mockDonors.filter(donor => donor.region === district);
      const donors = districtDonors.length;
      const amount = districtDonors.reduce((sum, donor) => sum + donor.totalDonated, 0);
      const percentage = totalDonors > 0 ? Math.round((donors / totalDonors) * 100) : 0;
      
      return {
        district,
        donors,
        amount,
        percentage,
        color: '#8ab371' // Using consistent color for all districts
      };
    });

    return districtData.sort((a, b) => b.amount - a.amount); // Sort by amount descending
  }, [mockDonors, totalDonors]);

  // --- Impact metrics ---
  const impactMetrics = [
    { metric: 'Children Reached', value: totalDonors * 7, growth: 15.2 },
    { metric: 'Learning Hours', value: Math.floor(totalRaised / 2), growth: 22.8 },
    { metric: 'Volunteer Hours', value: totalDonors * 13, growth: 8.7 },
    { metric: 'Partner Schools', value: 12, growth: 33.3 }
  ];

  const KPICard = ({ title, value, subtitle, icon: Icon, trend, colorClass = "text-plant-growth" }:{
    title: string; value: string; subtitle?: string; icon: LucideIcon; trend?: number; colorClass?: string;
  }) => (
    <Card className="shadow-soft">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-muted/30">
            <Icon className={`w-6 h-6 ${colorClass}`} />
          </div>
          {typeof trend === 'number' && (
            <div className={`flex items-center text-sm ${trend > 0 ? 'text-plant-growth' : 'text-red-500'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        <h3 className="text-2xl font-bold text-primary mb-1">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  const MetricCard = ({ title, value, growth, icon: Icon }:{
    title: string; value: number; growth: number; icon: LucideIcon;
  }) => (
    <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-plant-growth" />
        <span className="text-sm font-medium text-accent">+{growth}%</span>
      </div>
      <p className="text-lg font-bold text-primary">{value.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // --- Page sections ---
  const DonationTrendsCard = () => (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-plant-growth" />
          Donation Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={currentData.monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Legend />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--plant-growth))"
              fill="url(#colorAmount)"
              strokeWidth={2}
              name="Amount Raised ($)"
            />
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--plant-growth))" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(var(--plant-growth))" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const DonorGrowthCard = () => (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserPlus className="w-5 h-5 mr-2 text-plant-growth" />
          Donor Growth & Retention
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={currentData.monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Legend />
            <Line
              type="monotone"
              dataKey="donors"
              stroke="hsl(var(--plant-growth))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--plant-growth))', strokeWidth: 2, r: 4 }}
              name="Total Donors"
            />
            <Line
              type="monotone"
              dataKey="retention"
              stroke="#d2b48c"
              strokeWidth={2}
              dot={{ fill: '#d2b48c', strokeWidth: 2, r: 4 }}
              name="Retention Rate (%)"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const StatusDistributionCard = () => (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-plant-growth" />
          Donor Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={donorSegments}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              stroke="white"
              strokeWidth={2}
            >
              {donorSegments.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const AmountByDistrictCard = () => {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-plant-growth" />
            Amount Raised by District
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={geographicData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis
                dataKey="district"
                stroke="hsl(var(--muted-foreground))"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={60}
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(v) => `$${v.toLocaleString()}`}
              />
              <Tooltip
                formatter={(v: number) => [`$${v.toLocaleString()}`, 'Amount']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar
                dataKey="amount"
                name="Amount ($)"
                radius={[3, 3, 0, 0]}
                fill="#8ab371" 
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const SocialEngagementCard = () => (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-plant-growth" />
          Social Feed Engagement
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <ResponsiveContainer width="100%" height={480}>
          <BarChart data={socialFeedData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis
              dataKey="category"
              stroke="hsl(var(--muted-foreground))"
              angle={-35}
              textAnchor="end"
              height={10}
              interval={0}
              fontSize={11}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ paddingTop: '70px' }} />
            <Bar dataKey="views" fill="#8ab371" radius={[2, 2, 0, 0]} name="Views" />
            <Bar dataKey="likes" fill="hsl(var(--accent))" radius={[2, 2, 0, 0]} name="Likes" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const ImpactCard = () => (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="w-5 h-5 mr-2 text-plant-growth" />
          Impact Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {impactMetrics.map((m, i) => (
            <div key={i} className="bg-muted/30 rounded-lg p-4 border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-plant-growth" />
                <span className="text-sm font-medium text-accent">+{m.growth}%</span>
              </div>
              <p className="text-lg font-bold text-primary">{m.value.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{m.metric}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const ImpactStoriesCard = () => (
    <ImpactStoryFeed/>
  );

  const ProjectsListCard = () => (
    <ProjectsList/>
  );

  // --- Navigation items ---
  const NAV_ITEMS: { key: NavTab; label: string; icon: LucideIcon }[] = [
    { key: 'overview',           label: 'Overview',               icon: LayoutGrid },
    { key: 'donationTrends',     label: 'Donation Trends',        icon: Activity },
    { key: 'donorGrowth',        label: 'Donor Trends',           icon: Users },
    { key: 'statusDistribution', label: 'Donor Status Distribution',    icon: PieIcon },
    { key: 'districts',          label: 'District Analytics',    icon: MapPin },
    { key: 'socialEngagement',   label: 'Socials',                icon: MessageCircle },
    { key: 'impact',             label: 'Impact Overview',        icon: Layers },
    { key: 'impactStories',      label: 'Impact Stories',         icon: Book },
    { key: 'milestones',         label: 'Milestones',             icon: Milestone }
  ];

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={treeLogo} alt="Logo" className="h-8 w-auto" />
            <img src={reachTogetherLogo} alt="Reach Together" className="h-6 w-auto mt-1" />
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary">Admin: {user?.name}</Badge>
            <div className="flex space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRangeKey)}
                className="px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="3months">Last 3 months</option>
                <option value="6months">Last 6 months</option>
                <option value="1year">Last year</option>
              </select>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation bar */}
        <div className="container mx-auto px-4 pb-3 pt-2">
          <div className="flex flex-wrap gap-2">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setNavTab(key)}
                className={[
                  "px-3 py-2 rounded-lg border transition",
                  "bg-card text-foreground border-border/50 hover:border-accent/60",
                  navTab === key ? "ring-2 ring-accent" : ""
                ].join(" ")}
              >
                <span className="inline-flex items-center gap-2 text-sm">
                  <Icon className="w-4 h-4 text-plant-growth" />
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Pages */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {navTab === 'overview' && (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Donors"
                value={currentData.totalDonors.toString()}
                subtitle="Active this period"
                icon={Users}
                trend={currentData.trends.donors}
                colorClass="text-primary"
              />
              <KPICard
                title="Total Raised"
                value={`$${currentData.totalRaised.toLocaleString()}`}
                subtitle="This period"
                icon={DollarSign}
                trend={currentData.trends.amount}
                colorClass="text-plant-growth"
              />
              <KPICard
                title="Donor Retention"
                value={`${currentData.retention}%`}
                subtitle="Average retention"
                icon={Repeat}
                trend={currentData.trends.retention}
                colorClass="text-accent"
              />
              <KPICard
                title="Social Reach"
                value={currentData.socialReach.toLocaleString()}
                subtitle="Views & interactions"
                icon={Share2}
                trend={currentData.trends.social}
                colorClass="text-earth"
              />
            </div>

            {/* Recent activity */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-plant-growth" />
                  Recent Donor Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDonors.slice(0, RECENT_DONOR_COUNT).map((donor) => (
                    <div key={donor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-3 ${
                            donor.status === 'Premium' ? 'bg-orange-300' : 'bg-[#8ab371]'
                          }`}
                        />
                        <div>
                          <p className="font-medium text-primary">{donor.name}</p>
                          <p className="text-sm text-muted-foreground">{donor.region} • {donor.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-plant-growth">${donor.totalDonated}</p>
                        <p className="text-xs text-muted-foreground">{donor.lastDonation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {navTab === 'donationTrends' && <DonationTrendsCard />}
        {navTab === 'donorGrowth' && <DonorGrowthCard />}
        {navTab === 'statusDistribution' && <StatusDistributionCard />}
        {navTab === 'districts' && <AmountByDistrictCard />}
        {navTab === 'socialEngagement' && <SocialEngagementCard />}
        {navTab === 'impact' && <ImpactCard />}
        {navTab === 'impactStories' && <ImpactStoriesCard />}
        {navTab === 'milestones' && <ProjectsListCard />}
      </div>
    </div>
  );
};

export default AdminDashboard;