import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Users, TrendingUp, DollarSign, Heart, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock donor data
const mockDonors = [
  { id: 1, name: "Sarah Johnson", email: "sarah@email.com", totalDonated: 450, lastDonation: "2024-01-15", status: "Active", region: "District 1" },
  { id: 2, name: "Mike Chen", email: "mike@email.com", totalDonated: 320, lastDonation: "2024-01-14", status: "Active", region: "District 2" },
  { id: 3, name: "Emma Wilson", email: "emma@email.com", totalDonated: 678, lastDonation: "2024-01-13", status: "Premium", region: "District 1" },
  { id: 4, name: "David Brown", email: "david@email.com", totalDonated: 234, lastDonation: "2024-01-10", status: "Active", region: "District 3" },
  { id: 5, name: "Lisa Garcia", email: "lisa@email.com", totalDonated: 892, lastDonation: "2024-01-12", status: "Premium", region: "District 2" },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [donors] = useState(mockDonors);

  const filteredDonors = donors.filter(donor =>
    donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDonors = donors.length;
  const totalRaised = donors.reduce((sum, donor) => sum + donor.totalDonated, 0);
  const activeDonors = donors.filter(donor => donor.status === "Active").length;
  const premiumDonors = donors.filter(donor => donor.status === "Premium").length;

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
            <h1 className="text-2xl font-bold text-primary">Reach Together - Admin</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              Admin: {user?.name}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Donors</p>
                  <p className="text-3xl font-bold text-primary">{totalDonors}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Raised</p>
                  <p className="text-3xl font-bold text-plant-growth">${totalRaised.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-plant-growth" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Donors</p>
                  <p className="text-3xl font-bold text-accent">{activeDonors}</p>
                </div>
                <Heart className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Premium Donors</p>
                  <p className="text-3xl font-bold text-earth">{premiumDonors}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-earth" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donor Management */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Donor Management</CardTitle>
            <CardDescription>
              View and manage all donors in the system
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search donors by name, email, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Total Donated</TableHead>
                  <TableHead>Last Donation</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonors.map((donor) => (
                  <TableRow key={donor.id}>
                    <TableCell className="font-medium">{donor.name}</TableCell>
                    <TableCell>{donor.email}</TableCell>
                    <TableCell>{donor.region}</TableCell>
                    <TableCell>${donor.totalDonated}</TableCell>
                    <TableCell>{donor.lastDonation}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={donor.status === 'Premium' ? 'default' : 'secondary'}
                        className={donor.status === 'Premium' ? 'bg-plant-growth text-primary-foreground' : ''}
                      >
                        {donor.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Latest donation activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donors.slice(0, 5).map((donor) => (
                  <div key={donor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{donor.name}</p>
                      <p className="text-sm text-muted-foreground">{donor.region}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-plant-growth">${donor.totalDonated}</p>
                      <p className="text-xs text-muted-foreground">{donor.lastDonation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Regional Distribution</CardTitle>
              <CardDescription>Donors by district</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['District 1', 'District 2', 'District 3'].map((district) => {
                  const count = donors.filter(donor => donor.region === district).length;
                  const percentage = Math.round((count / totalDonors) * 100);
                  
                  return (
                    <div key={district} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{district}</span>
                        <span className="text-sm text-muted-foreground">{count} donors ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-plant-growth h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;