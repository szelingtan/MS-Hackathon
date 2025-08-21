import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Users, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import heroImage from "@/assets/hero-plant-hands.jpg";

const Landing = () => {
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
    <div className="min-h-screen bg-gradient-sky">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-8 lg:px-16 py-16">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-24 items-center">
            
            {/* Hero Content */}
            <div className="space-y-8 text-center lg:text-left pl-0 lg:pl-8">
              {/* App Name */}
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
                <Sprout className="h-10 w-10 text-plant-growth animate-leaf-sway" />
                <h1 className="text-4xl font-bold text-primary">Reach Together</h1>
              </div>

              {/* Main Title */}
              <div>
                <h2 className="text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
                  Growing Communities
                  <span className="bg-gradient-growth bg-clip-text text-transparent"> Together</span>
                </h2>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Join our donor community to support schools and communities. 
                  Grow your virtual plant while making real impact in the world.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" variant="nature" className="text-lg px-8 py-6">
                  <Sprout className="h-5 w-5 mr-2" />
                  Start Growing Impact
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Learn More
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative pr-0 lg:pr-8">
              <div className="absolute inset-0 bg-gradient-growth rounded-3xl blur-3xl opacity-30 animate-float"></div>
              <img 
                src={heroImage} 
                alt="Hands nurturing a growing plant representing community support and connection"
                className="relative rounded-3xl shadow-growth w-full h-auto transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Our Growing Impact</h3>
            <p className="text-lg text-muted-foreground">See the difference we're making together</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <Card className="text-center shadow-plant hover:shadow-growth transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-plant-growth mb-2">1,247</div>
                <p className="text-muted-foreground font-medium">Trees Planted</p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-plant hover:shadow-growth transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-accent mb-2">89</div>
                <p className="text-muted-foreground font-medium">Schools Supported</p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-plant hover:shadow-growth transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-water mb-2">5,678</div>
                <p className="text-muted-foreground font-medium">Active Donors</p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-plant hover:shadow-growth transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-earth mb-2">$127K</div>
                <p className="text-muted-foreground font-medium">Total Raised</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-foreground mb-4">Ready to join us in making an impact?</h3>
            <p className="text-lg text-muted-foreground">Choose your path to start growing your garden</p>
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
        </div>
      </section>
    </div>
  );
};

export default Landing;