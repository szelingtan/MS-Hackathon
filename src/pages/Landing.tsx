import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, Telescope, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/landingpage.png";
import logoImage from "@/assets/newlogo.png";

const Landing = () => {
  const navigate = useNavigate();
  
  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-8 lg:px-16 py-16">
          <div className="space-y-16">
            {/* Hero Content and Image */}
            <div className="grid lg:grid-cols-2 gap-20 lg:gap-24 items-start">
              
              {/* Hero Content */}
              <div className="space-y-8 text-center lg:text-left pl-0 lg:pl-8">
                {/* Logo and Title */}
                <div className="flex items-center space-x-4 mb-6 -ml-4 mt-8">
                  <img src={logoImage} alt="ReachTogether" className="h-56 w-auto" />
                  <div className="flex flex-col mt-6">
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-none">Growing</h2>
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-none">Communities</h2>
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-none">
                      <span className="bg-gradient-growth bg-clip-text text-transparent">Together</span>
                    </h2>
                  </div>
                </div>

                {/* Main Description */}
                <div className="mt-4">
                  <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Join Project Reach's donor community to support schools and communities. 
                    Grow your virtual plant while making real impact in the world.
                  </p>
                </div>
              </div>

              {/* Right Column: CTA Button + Hero Image */}
              <div className="space-y-8 pr-0 lg:pr-8">
                {/* Start Growing Impact Button */}
                <div className="flex justify-center lg:justify-end">
                  <Button 
                    size="default" 
                    variant="nature" 
                    className="text-base px-6 py-3 shadow-plant hover:shadow-growth transition-all duration-300 transform hover:-translate-y-1" 
                    onClick={handleLoginClick}
                  >
                    <Sprout className="h-4 w-4 mr-2" />
                    Start Growing Impact
                  </Button>
                </div>

                {/* Hero Image */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-growth rounded-3xl blur-3xl opacity-30 animate-float"></div>
                  <img 
                    src={heroImage} 
                    alt="Hands nurturing a growing plant representing community support and connection"
                    className="relative rounded-3xl shadow-growth w-full h-auto transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Mission & Vision Section */}
            <div className="pl-0 lg:pl-8 space-y-8">
              {/* Vision Card */}
              <Card className="shadow-soft hover:shadow-plant transition-all duration-300">
                <CardContent className="p-8 lg:p-10">
                  <div className="text-center lg:text-left space-y-6">
                    <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-growth rounded-full flex items-center justify-center">
                        <Telescope className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-foreground">Our Vision</h3>
                    </div>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p className="text-lg">
                        Hong Kong is one of the most unequal cities, with <span className="font-semibold text-foreground">40,000 kindergarten students living in poverty</span>. Underfunded kindergartens receive far less support than primary or secondary schools, with <span className="font-semibold text-destructive">29 closures in 2025-2026</span>, the highest in a decade.
                      </p>
                      <p className="text-lg">
                        <span className="font-semibold text-plant-growth">Project Reach</span> is the first initiative to address inequality by tackling the English proficiency gap among underserved kindergarten students transitioning to Primary 1.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mission Card */}
              <Card className="shadow-soft hover:shadow-plant transition-all duration-300">
                <CardContent className="p-8 lg:p-10">
                  <div className="text-center lg:text-left space-y-6">
                    <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-water rounded-full flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-foreground">Our Mission</h3>
                    </div>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p className="text-lg">
                        Project Reach aims to become part of the kindergarten curriculum for schools in need across Hong Kong. We strive to create the <span className="font-semibold text-accent">first database tracking English proficiency</span> of underserved K3 students to improve programmes and raise awareness of early childhood poverty.
                      </p>
                      <p className="text-lg">
                        Additionally, we aim to secure funding from primary schools to continue supporting students as they <span className="font-semibold text-plant-growth">transition into Primary 1</span>.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Integrated Stats */}
            <div className="pl-0 lg:pl-8">
              <div className="text-center lg:text-left mb-8">
                <div className="text-2xl lg:text-3xl font-bold text-foreground">Our Growing Impact</div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mb-12">
                <Card className="text-center shadow-plant hover:shadow-growth transition-all duration-300 transform hover:-translate-y-2">
                  <CardContent className="pt-6 pb-5">
                    <div className="text-3xl lg:text-4xl font-bold text-plant-growth mb-2">1,247</div>
                    <p className="text-muted-foreground font-medium text-sm lg:text-base">Trees Planted</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center shadow-plant hover:shadow-growth transition-all duration-300 transform hover:-translate-y-2">
                  <CardContent className="pt-6 pb-5">
                    <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">89</div>
                    <p className="text-muted-foreground font-medium text-sm lg:text-base">Schools Supported</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center shadow-plant hover:shadow-growth transition-all duration-300 transform hover:-translate-y-2">
                  <CardContent className="pt-6 pb-5">
                    <div className="text-3xl lg:text-4xl font-bold text-water mb-2">5,678</div>
                    <p className="text-muted-foreground font-medium text-sm lg:text-base">Active Donors</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center shadow-plant hover:shadow-growth transition-all duration-300 transform hover:-translate-y-2">
                  <CardContent className="pt-6 pb-5">
                    <div className="text-3xl lg:text-4xl font-bold text-earth mb-2">$127K</div>
                    <p className="text-muted-foreground font-medium text-sm lg:text-base">Total Raised</p>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;