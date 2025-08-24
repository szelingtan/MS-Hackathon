"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, Target, CalendarDays } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type Project = {
  id: number
  district: string
  title: string
  description: string
  goal: number
  raised: number
  category: string
  urgency: string
  image: string
  supporters: number
}

type MilestoneEntry = {
  projectId: number
  title: string
  district: string
  milestones: Milestone[]
}

type Milestone = {
  id: string
  title: string
  description: string
  impact: string
  image: string
  date: string
}

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "high": return "text-red-500 bg-red-50 border-red-200"
    case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200"
    case "low": return "text-green-600 bg-green-50 border-green-200"
    default: return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

const handleAddMilestone = (projectId: number) => {
  console.log("Not yet implemented")
}


const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [milestones, setMilestones] = useState<MilestoneEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, milestonesRes] = await Promise.all([
          fetch("/hk-game/data/donation-projects.json"),
          fetch("/hk-game/data/milestones.json")
        ])

        if (projectsRes.ok && milestonesRes.ok) {
          const projectData: Project[] = await projectsRes.json()
          const milestoneData: MilestoneEntry[] = await milestonesRes.json()
          setProjects(projectData)
          setMilestones(milestoneData)
        }
      } catch (err) {
        console.error("Failed to load data", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <Card className="shadow-soft">
     <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-plant-growth" />
            Project Milestones
          </CardTitle>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search projects by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-plant-growth"
            />
            <button
              type="button"
              className="bg-plant-growth text-white px-4 py-2 rounded hover:bg-plant-growth-dark transition w-60"
            >
              + Add Project
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          {filteredProjects.length === 0 && (
            <p className="text-center text-gray-500">No projects found.</p>
          )}

          {filteredProjects.map((project) => {
            /* ... your existing rendering logic ... */
            const progress = Math.min(100, (project.raised / project.goal) * 100)
            const milestoneEntry = milestones.find(m => m.projectId === project.id)
            const projectMilestones = milestoneEntry?.milestones || []

            return (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition flex flex-col md:flex-row overflow-hidden"
              >
                {/* Left: Project Info */}
                <div className="md:w-1/4 p-4 flex flex-col justify-between border-r border-gray-100">
                  {/* Your existing left panel content */}
                  <div>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.district}</p>
                    <Badge className={`text-xs mt-2 ${getUrgencyColor(project.urgency)}`}>
                      <Clock className="h-3 w-3 mr-1" />
                      {project.urgency.charAt(0).toUpperCase() + project.urgency.slice(1)} Priority
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span>Raised: ${project.raised.toLocaleString()}</span>
                      <span>Goal: ${project.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    {/* Add Milestone button here */}
                    <button
                      onClick={() => handleAddMilestone(project.id)}
                      className="mt-4 w-full bg-plant-growth text-white py-2 rounded hover:bg-plant-growth-dark transition"
                    >
                      + Add Milestone
                    </button>
                  </div>
                </div>

                {/* Right: Milestones */}
                <div className="md:w-3/4 p-4 bg-gray-50">
                  {projectMilestones.length > 0 ? (
                    <>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Milestones</div>
                      <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 pb-1 pr-1">
                        {projectMilestones.map((mile) => (
                          <div
                            key={mile.id}
                            className="w-[320px] h-[300px] bg-white border rounded-lg p-3 flex-shrink-0 shadow-sm flex flex-col"
                          >
                            <img
                              src={mile.image}
                              alt={mile.title}
                              className="w-full h-24 object-cover rounded mb-2"
                            />
                            <div className="text-xs font-bold mb-1">{mile.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2 flex-1">
                              {mile.description}
                            </div>
                            <div className="text-[11px] mt-2 text-emerald-700">{mile.impact}</div>
                            <div className="flex items-center text-[10px] text-gray-500 mt-1">
                              <CalendarDays className="h-3 w-3 mr-1" />
                              {new Date(mile.date).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-400 italic">No milestones yet</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectsList