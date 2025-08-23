"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const project = {
  id: 1,
  district: "Central & Western",
  title: "Central Learning Hub Expansion",
  description:
    "Help us expand our after-school learning center to accommodate 100 more students with new classrooms and equipment.",
  goal: 50000,
  raised: 32000,
  supporters: 156,
  urgency: "high",
  category: "Education",
  image: "/api/placeholder/300/200",
  milestones: [
    {
      id: "mile-1-1",
      title: "Center Construction Completed",
      description:
        "Renovation and setup of classrooms and facilities finalized.",
      impact: "Facility ready for use",
      image: "/api/placeholder/300/200",
      date: "2025-07-15",
    },
    {
      id: "mile-1-2",
      title: "First Batch of Students Enrolled",
      description: "Fifty students began attending after-school sessions.",
      impact: "50 students supported",
      image: "/api/placeholder/300/200",
      date: "2025-08-21",
    },
  ],
}

export default function ProjectDetails() {
  const progress = (project.raised / project.goal) * 100

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <img
          src={project.image}
          alt={project.title}
          width={300}
          height={200}
          className="rounded-md object-cover"
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-sm text-muted-foreground">{project.district}</p>
          <Badge variant="outline">{project.category}</Badge>
          <Badge
            className={`ml-2 ${
              project.urgency === "high"
                ? "bg-red-500 text-white"
                : project.urgency === "medium"
                ? "bg-yellow-400 text-black"
                : "bg-green-500 text-white"
            }`}
          >
            {project.urgency.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between text-sm">
            <p>
              <strong>Goal:</strong> ${project.goal.toLocaleString()}
            </p>
            <p>
              <strong>Raised:</strong> ${project.raised.toLocaleString()}
            </p>
            <p>
              <strong>Supporters:</strong> {project.supporters}
            </p>
          </div>
          <Progress value={progress} />
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{project.description}</p>
        </CardContent>
      </Card>

      {/* Milestones */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Milestones</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {project.milestones.map((milestone) => (
            <Card key={milestone.id}>
              <CardHeader>
                <CardTitle>{milestone.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <img
                  src={milestone.image}
                  alt={milestone.title}
                  width={300}
                  height={200}
                  className="rounded-md object-cover"
                />
                <p className="text-sm text-muted-foreground">
                  <strong>Date:</strong> {milestone.date}
                </p>
                <p>{milestone.description}</p>
                <p className="text-green-600 italic">
                  <strong>Impact:</strong> {milestone.impact}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

