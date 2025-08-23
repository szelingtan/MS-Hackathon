import { Badge, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useNavigate } from 'react-router-dom';

const ProfileProjects = () => {
  const projects = [
    {
      id: 19,
      title: "Sunnydale Elementary Computer Lab",
      description: "Building a new computer lab with 20 computers for students",
      totalGoal: 5000,
      currentRaised: 3200,
      userContribution: 125,
      status: "active",
      progress: 64
    },
    {
      id: 20,
      title: "Green Valley Environmental Education",
      description: "Sustainability and environmental awareness program",
      totalGoal: 12000,
      currentRaised: 8500,
      userContribution: 175,
      status: "active",
      progress: 71
    }
  ];
  const navigate = useNavigate();
  const viewDetails = (id: number) => {
    navigate(`/project/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Projects Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center shadow-soft">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-plant-growth">{projects.length}</div>
            <p className="text-sm text-muted-foreground">Projects Supported</p>
          </CardContent>
        </Card>
        <Card className="text-center shadow-soft">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-accent">
              ${projects.reduce((sum, p) => sum + p.userContribution, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Contributed</p>
          </CardContent>
        </Card>
        <Card className="text-center shadow-soft">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-water">0</div>
            <p className="text-sm text-muted-foreground">Projects Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Project List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <button
                onClick={() => viewDetails(project.id)}
                className="ml-2 inline-flex text-sm text-[#b58863] hover:text-[#a06f43] hover:underline transition"
              >
                <ExternalLink className="h-4 w-4" />
                View Details
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Project Progress</span>
                  <span>${project.currentRaised.toLocaleString()} / ${project.totalGoal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-growth h-2 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">{project.progress}% funded</p>
              </div>

              {/* Your Contribution */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Your Contribution</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-bold text-green-600">${project.userContribution}</p>
                    <p className="text-sm text-blue-600">
                      {((project.userContribution / project.currentRaised) * 100).toFixed(1)}% of total raised
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    {project.status}
                  </Badge>
                </div>
              </div>

              {/* Impact Preview */}
              <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-800 mb-1">Latest Update</h5>
                <p className="text-sm text-green-700">
                  {project.id === 1 
                    ? "75% of computers have been ordered! Installation begins next month."
                    : "First round of environmental workshops completed successfully."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileProjects;