import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Users, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(userEmail, userPassword, 'user');
    if (success) {
      toast.success("Welcome to your garden!");
      navigate('/dashboard');
    } else {
      toast.error("Invalid credentials. Try password: 'password'");
    }
    setIsLoading(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(adminEmail, adminPassword, 'admin');
    if (success) {
      toast.success("Admin access granted");
      navigate('/admin');
    } else {
      toast.error("Invalid admin credentials. Try password: 'password'");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Sprout className="h-12 w-12 text-plant-growth animate-leaf-sway" />
            <h1 className="text-4xl font-bold text-primary">Reach Together</h1>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Welcome Back</h2>
          <p className="text-lg text-muted-foreground">Choose your login type to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Donor Login Card */}
          <Card className="shadow-soft hover:shadow-plant transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Users className="h-6 w-6 text-plant-growth" />
                For Donors
              </CardTitle>
              <CardDescription className="text-base">
                Start your giving journey and grow your virtual garden
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleUserLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-email" className="text-base">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="donor@email.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-password" className="text-base">Password</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="nature" 
                  size="lg"
                  className="w-full h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Enter Garden"}
                </Button>
              </form>
              <p className="text-sm text-muted-foreground text-center">
                Demo: Use any email and password "password"
              </p>
            </CardContent>
          </Card>

          {/* Reach Team Login Card */}
          <Card className="shadow-soft hover:shadow-plant transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Shield className="h-6 w-6 text-accent" />
                For Reach Team
              </CardTitle>
              <CardDescription className="text-base">
                Team members access dashboard and platform management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-base">Team Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="team@reachtogether.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="text-base">Team Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="earth" 
                  size="lg"
                  className="w-full h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Manage Platform"}
                </Button>
              </form>
              <p className="text-sm text-muted-foreground text-center">
                Demo: Use any email and password "password"
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;