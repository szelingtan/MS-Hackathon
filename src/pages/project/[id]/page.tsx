"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

type Milestone = {
id: string
title: string
description: string
impact: string
image: string
date: string
}

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
userDonation?: number
}

type ProjectMilestones = {
projectId: number
district: string
title: string
milestones: Milestone[]
}

const loadMyDonations = (): Record<number, number> => {
if (typeof window !== "undefined") {
    const stored = localStorage.getItem("donations")
    return stored ? JSON.parse(stored) : {}
}
return {}
}

const ProjectDetails = () => {
const { id } = useParams()
const projectId = parseInt(id || "0")
const navigate = useNavigate()

const [projectMilestones, setProjectMilestones] = useState<ProjectMilestones | null>(null)
const [projectData, setProjectData] = useState<Project | null>(null)
const [myDonations, setMyDonations] = useState<Record<number, number>>({})
const [loading, setLoading] = useState(true)

useEffect(() => {
    const loadData = async () => {
    try {
        const [milestonesRes, projectsRes] = await Promise.all([
        fetch("/hk-game/data/milestones.json"),
        fetch("/hk-game/data/donation-projects.json"),
        ])

        if (milestonesRes.ok && projectsRes.ok) {
        const milestonesData: ProjectMilestones[] = await milestonesRes.json()
        const projectsData: Project[] = await projectsRes.json()
        const matchedProjectMilestones = milestonesData.find(p => p.projectId === projectId)
        const matchedProject = projectsData.find(p => p.id === projectId)
        const userDonations = loadMyDonations()

        if (matchedProject) {
            matchedProject.userDonation = userDonations[projectId] || 0
            matchedProject.raised += matchedProject.userDonation
        }

        setProjectMilestones(matchedProjectMilestones || null)
        setProjectData(matchedProject || null)
        setMyDonations(userDonations)
        }
    } catch (error) {
        console.error("Error loading project data:", error)
    } finally {
        setLoading(false)
    }
    }

    loadData()
}, [projectId])

if (loading) {
    return (
    <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
    </div>
    )
}

if (!projectMilestones || !projectData) {
    return (
    <div className="min-h-screen flex items-center justify-center">
        <div>
        <h2 className="text-xl font-bold">Project not found</h2>
        <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-blue-600 underline"
        >
            Go back
        </button>
        </div>
    </div>
    )
}

const progress = Math.min(100, (projectData.raised / projectData.goal) * 100)

return (
    <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Card container */}
        <div className="relative bg-white rounded-lg shadow-lg p-8 space-y-8">
        {/* Back Button */}
        <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-sm text-[#b58863] hover:text-[#a06f43] transition duration-150 mb-6"
        >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
        </button>

        {/* Title & District */}
        <h1 className="text-3xl font-bold mb-1">{projectData.title}</h1>

        {/* Badges */}
        <div className="flex gap-3 mb-6 flex-wrap">
            <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
            {projectData.district}
            </span>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            {projectData.category}
            </span>
            <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
            {projectData.urgency}
            </span>
        </div>

        {/* Goal & Raised Progress Bar */}
        <div className="mb-6">
            <div className="flex justify-between text-sm font-medium mb-1">
            <span>Goal: ${projectData.goal.toLocaleString()}</span>
            <span>Raised: ${projectData.raised.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-5 overflow-hidden shadow-inner">
            <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
            ></div>
            </div>
            {projectData.userDonation ? (
            <p className="mt-2 text-green-700 font-semibold">
                Your donation: ${projectData.userDonation.toLocaleString()}
            </p>
            ) : null}
        </div>

        {/* Milestones */}
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Milestones</h2>
            {projectMilestones.milestones.length === 0 && (
            <p className="text-gray-500 italic">No milestones available for this project.</p>
            )}
            <div className="grid gap-6 md:grid-cols-2">
            {projectMilestones.milestones.map((milestone) => (
                <div
                key={milestone.id}
                className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
                >
                <div className="flex flex-col md:flex-row gap-4">
                    <img
                    src={milestone.image}
                    alt={milestone.title}
                    className="w-full md:w-40 h-28 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex flex-col justify-between">
                    <h3 className="text-lg font-semibold">{milestone.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">Date: {milestone.date}</p>
                    <p className="text-gray-700 mb-2">{milestone.description}</p>
                    <p className="italic text-green-600 font-semibold">Impact: {milestone.impact}</p>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    </div>
    )
}

export default ProjectDetails