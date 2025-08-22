import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, TrendingUp, Heart, UserPlus, Repeat, Share2, Target, MapPin, MessageCircle, Eye, ThumbsUp, Shield, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [timeRange, setTimeRange] = useState('6months');
  
  // Mock donor data matching your teammate's structure
  const mockDonors = [
    { id: 1, name: "Sarah Johnson", email: "sarah@email.com", totalDonated: 450, lastDonation: "2024-01-15", status: "Active", region: "District 1" },
    { id: 2, name: "Mike Chen", email: "mike@email.com", totalDonated: 320, lastDonation: "2024-01-14", status: "Active", region: "District 2" },
    { id: 3, name: "Emma Wilson", email: "emma@email.com", totalDonated: 678, lastDonation: "2024-01-13", status: "Premium", region: "District 1" },
    { id: 4, name: "David Brown", email: "david@email.com", totalDonated: 234, lastDonation: "2024-01-10", status: "Active", region: "District 3" },
    { id: 5, name: "Lisa Garcia", email: "lisa@email.com", totalDonated: 892, lastDonation: "2024-01-12", status: "Premium", region: "District 2" },
    { id: 6, name: "John Wong", email: "john@email.com", totalDonated: 567, lastDonation: "2024-01-11", status: "Active", region: "District 1" },
    { id: 7, name: "Amy Lee", email: "amy@email.com", totalDonated: 345, lastDonation: "2024-01-09", status: "Active", region: "District 3" },
    { id: 8, name: "Peter Tam", email: "peter@email.com", totalDonated: 789, lastDonation: "2024-01-08", status: "Premium", region: "District 2" },
    { id: 9, name: "Jenny Kim", email: "jenny@email.com", totalDonated: 456, lastDonation: "2024-01-07", status: "Active", region: "District 1" },
    { id: 10, name: "Alex Ng", email: "alex@email.com", totalDonated: 623, lastDonation: "2024-01-06", status: "Premium", region: "District 3" },
    { id: 11, name: "Grace Liu", email: "grace@email.com", totalDonated: 298, lastDonation: "2024-01-05", status: "Active", region: "District 2" },
    { id: 12, name: "Kevin Lau", email: "kevin@email.com", totalDonated: 534, lastDonation: "2024-01-04", status: "Active", region: "District 1" }
  ];

  // Calculate metrics from donor data
  const totalDonors = mockDonors.length;
  const totalRaised = mockDonors.reduce((sum, donor) => sum + donor.totalDonated, 0);
  const activeDonors = mockDonors.filter(donor => donor.status === "Active").length;
  const premiumDonors = mockDonors.filter(donor => donor.status === "Premium").length;

  // Sample data for different time periods based on donor data
  const dataByPeriod = {
    '3months': {
      monthly: [
        { month: 'Jun', donors: Math.floor(totalDonors * 0.6), amount: Math.floor(totalRaised * 0.3), newDonors: 3, retention: 85 },
        { month: 'Jul', donors: Math.floor(totalDonors * 0.8), amount: Math.floor(totalRaised * 0.6), newDonors: 4, retention: 88 },
        { month: 'Aug', donors: totalDonors, amount: totalRaised, newDonors: 5, retention: 92 }
      ],
      totalDonors: totalDonors,
      totalRaised: totalRaised,
      retention: 92,
      socialReach: 1200,
      trends: { donors: 15.2, amount: 28.5, retention: 4.1, social: 18.7 }
    },
    '6months': {
      monthly: [
        { month: 'Mar', donors: Math.floor(totalDonors * 0.25), amount: Math.floor(totalRaised * 0.15), newDonors: 2, retention: 78 },
        { month: 'Apr', donors: Math.floor(totalDonors * 0.35), amount: Math.floor(totalRaised * 0.25), newDonors: 3, retention: 82 },
        { month: 'May', donors: Math.floor(totalDonors * 0.5), amount: Math.floor(totalRaised * 0.4), newDonors: 3, retention: 85 },
        { month: 'Jun', donors: Math.floor(totalDonors * 0.65), amount: Math.floor(totalRaised * 0.55), newDonors: 4, retention: 87 },
        { month: 'Jul', donors: Math.floor(totalDonors * 0.8), amount: Math.floor(totalRaised * 0.75), newDonors: 4, retention: 90 },
        { month: 'Aug', donors: totalDonors, amount: totalRaised, newDonors: 5, retention: 92 }
      ],
      totalDonors: totalDonors,
      totalRaised: totalRaised,
      retention: 92,
      socialReach: 2340,
      trends: { donors: 26.8, amount: 35.6, retention: 8.2, social: 34.5 }
    },
    '1year': {
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
      totalDonors: totalDonors,
      totalRaised: totalRaised,
      retention: 92,
      socialReach: 4680,
      trends: { donors: 42.3, amount: 58.4, retention: 12.8, social: 48.7 }
    }
  };

  const currentData = dataByPeriod[timeRange];

  const donorSegments = [
    { name: 'Active', value: activeDonors, color: '#8ab371' },
    { name: 'Premium', value: premiumDonors, color: '#fdba74' }
  ];

  // Social feed engagement data
  const socialFeedData = [
    { category: 'Impact Stories', posts: 28, views: 1420, likes: 156, shares: 42 },
    { category: 'Parent Updates', posts: 34, views: 1680, likes: 203, shares: 28 },
    { category: 'Organization News', posts: 15, views: 890, likes: 98, shares: 31 },
    { category: 'Volunteer Highlights', posts: 12, views: 640, likes: 87, shares: 19 }
  ];

  // Geographic distribution data (3 districts only)
  const getDistrictData = () => {
    const districts = ['District 1', 'District 2', 'District 3'];
    return districts.map(district => {
      const districtDonors = mockDonors.filter(donor => donor.region === district);
      const donorCount = districtDonors.length;
      const totalAmount = districtDonors.reduce((sum, donor) => sum + donor.totalDonated, 0);
      return {
        district,
        donors: donorCount,
        amount: totalAmount,
        percentage: Math.round((donorCount / totalDonors) * 100),
        color: district === 'District 1' ? '#8ab371' : district === 'District 2' ? '#87ceeb' : '#fdba74'
      };
    });
  };

  const geographicData = getDistrictData();

  const impactMetrics = [
    { metric: 'Children Reached', value: totalDonors * 7, growth: 15.2 },
    { metric: 'Learning Hours', value: Math.floor(totalRaised / 2), growth: 22.8 },
    { metric: 'Volunteer Hours', value: totalDonors * 13, growth: 8.7 },
    { metric: 'Partner Schools', value: 12, growth: 33.3 }
  ];

  const KPICard = ({ title, value, subtitle, icon: Icon, trend, colorClass = "text-plant-growth" }) => (
    <Card className="shadow-soft">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-muted/30`}>
            <Icon className={`w-6 h-6 ${colorClass}`} />
          </div>
          {trend && (
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

  const MetricCard = ({ title, value, growth, icon: Icon }) => (
    <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-plant-growth" />
        <span className="text-sm font-medium text-accent">+{growth}%</span>
      </div>
      <p className="text-lg font-bold text-primary">{value.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-accent" />
            <h1 className="text-2xl font-bold text-primary">ReachTogether Analytics</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              Admin: {user?.name}
            </Badge>
            <div className="flex space-x-2">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
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
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Key Performance Indicators */}
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

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donation Trends */}
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
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
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

          {/* Donor Growth */}
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
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
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
                    connectNulls={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donor Segments */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-plant-growth" />
                Donor Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
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
                    {donorSegments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-plant-growth" />
                Donors by District
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geographicData.map((district, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{district.district}</span>
                      <span className="text-sm text-muted-foreground">{district.donors} donors ({district.percentage}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ width: `${district.percentage}%`, backgroundColor: district.color }}
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-plant-growth">${district.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Feed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Social Feed Engagement */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-plant-growth" />
                Social Feed Engagement
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <ResponsiveContainer width="100%" height={480}>
                <BarChart data={socialFeedData} margin={{ top: 20, right: 30, left: 20, bottom: 0}}>
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
                  <YAxis stroke="hsl(var(--muted-foreground))"/>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '70px' }} />
                  <Bar dataKey="views" fill='#8ab371' radius={[2, 2, 0, 0]} name="Views" />
                  <Bar dataKey="likes" fill="hsl(var(--accent))" radius={[2, 2, 0, 0]} name="Likes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Impact Metrics */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-plant-growth" />
                Impact Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {impactMetrics.map((metric, index) => (
                  <MetricCard 
                    key={index}
                    title={metric.metric}
                    value={metric.value}
                    growth={metric.growth}
                    icon={Target}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-plant-growth" />
              Recent Donor Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDonors.slice(0, 5).map((donor) => (
                <div key={donor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      donor.status === 'Premium' ? 'bg-orange-300' : 'bg-[#8ab371]'
                    }`}></div>
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
      </div>
    </div>
  );
};

export default AdminDashboard;