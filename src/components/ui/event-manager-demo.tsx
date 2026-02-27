"use client"

import { EventManager, type Event } from "@/components/ui/event-manager"

export default function EventManagerDemo() {
  const demoEvents: Event[] = [
    {
      id: "1",
      title: "Team Standup",
      description: "Daily sync with the engineering team to discuss progress and blockers",
      startTime: new Date(2025, 9, 20, 9, 0),
      endTime: new Date(2025, 9, 20, 9, 30),
      color: "blue",
      category: "Meeting",
      attendees: ["Alice", "Bob", "Charlie"],
      tags: ["Work", "Team"],
    },
    {
      id: "2",
      title: "Product Design Review",
      description: "Review new mockups for the dashboard redesign with stakeholders",
      startTime: new Date(2025, 9, 20, 14, 0),
      endTime: new Date(2025, 9, 20, 15, 30),
      color: "gold",
      category: "Meeting",
      attendees: ["Sarah", "Mike"],
      tags: ["Important", "Client"],
    },
    {
      id: "3",
      title: "Code Review",
      description: "Review pull requests for the authentication feature",
      startTime: new Date(2025, 9, 21, 10, 0),
      endTime: new Date(2025, 9, 21, 11, 0),
      color: "green",
      category: "Task",
      tags: ["Work", "Urgent"],
    },
    {
      id: "4",
      title: "Client Presentation",
      description: "Present Q4 roadmap and feature updates to key stakeholders",
      startTime: new Date(2025, 9, 22, 15, 0),
      endTime: new Date(2025, 9, 22, 16, 30),
      color: "orange",
      category: "Meeting",
      attendees: ["John", "Emma", "David"],
      tags: ["Important", "Client"],
    },
    {
      id: "5",
      title: "Sprint Planning",
      description: "Plan tasks and estimate story points for the upcoming sprint",
      startTime: new Date(2025, 9, 23, 10, 0),
      endTime: new Date(2025, 9, 23, 12, 0),
      color: "blue",
      category: "Meeting",
      attendees: ["Team"],
      tags: ["Work", "Team", "Important"],
    },
    {
      id: "6",
      title: "Deploy to Production",
      description: "Deploy version 2.5.0 with new features and bug fixes",
      startTime: new Date(2025, 9, 25, 16, 0),
      endTime: new Date(2025, 9, 25, 17, 0),
      color: "green",
      category: "Task",
      tags: ["Work", "Urgent"],
    },
  ]

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <EventManager
        events={demoEvents}
        onEventCreate={(event) => console.log("Created:", event)}
        onEventUpdate={(id, event) => console.log("Updated:", id, event)}
        onEventDelete={(id) => console.log("Deleted:", id)}
        categories={["Meeting", "Task", "Reminder", "Personal"]}
        availableTags={["Important", "Urgent", "Work", "Personal", "Team", "Client"]}
        defaultView="month"
      />
    </div>
  )
}
