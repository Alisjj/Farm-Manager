"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, Egg, Package, AlertTriangle, Plus, Calendar } from "lucide-react"

export function StaffTasks() {
  const [selectedHouse, setSelectedHouse] = useState("")
  const [eggCount, setEggCount] = useState("")
  const [feedAmount, setFeedAmount] = useState("")

  const assignments = [
    {
      id: 1,
      title: "Morning Egg Collection",
      house: "House A",
      time: "6:00 AM - 8:00 AM",
      status: "completed",
      description: "Collect and count eggs from all nesting boxes",
    },
    {
      id: 2,
      title: "Feed Distribution",
      house: "House B",
      time: "7:30 AM - 8:30 AM",
      status: "completed",
      description: "Distribute morning feed ration",
    },
    {
      id: 3,
      title: "Afternoon Egg Collection",
      house: "House A",
      time: "2:00 PM - 4:00 PM",
      status: "pending",
      description: "Second daily egg collection round",
    },
    {
      id: 4,
      title: "Water System Check",
      house: "All Houses",
      time: "4:00 PM - 5:00 PM",
      status: "pending",
      description: "Check water levels and clean systems",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-balance">My Tasks</h2>
          <p className="text-muted-foreground">Daily assignments and data entry</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date().toLocaleDateString()}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Task List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Assignments</CardTitle>
              <CardDescription>Your scheduled tasks for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {assignment.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-orange-500" />
                        )}
                        <h4 className="font-medium">{assignment.title}</h4>
                      </div>
                      <Badge variant={assignment.status === "completed" ? "default" : "secondary"}>
                        {assignment.status === "completed" ? "Done" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{assignment.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{assignment.house}</span>
                      <span>{assignment.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Entry Forms */}
        <div className="space-y-4">
          {/* Egg Collection Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Egg className="h-5 w-5" />
                Log Egg Collection
              </CardTitle>
              <CardDescription>Record eggs collected from assigned houses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="house-select">House</Label>
                <Select value={selectedHouse} onValueChange={setSelectedHouse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select house" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house-a">House A</SelectItem>
                    <SelectItem value="house-b">House B</SelectItem>
                    <SelectItem value="house-c">House C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="egg-count">Total Eggs Collected</Label>
                <Input
                  id="egg-count"
                  type="number"
                  placeholder="Enter count"
                  value={eggCount}
                  onChange={(e) => setEggCount(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="egg-notes">Notes (optional)</Label>
                <Textarea id="egg-notes" placeholder="Any observations or issues..." className="min-h-[80px]" />
              </div>

              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Submit Collection
              </Button>
            </CardContent>
          </Card>

          {/* Feed Distribution Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Log Feed Distribution
              </CardTitle>
              <CardDescription>Record feed given to assigned houses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="feed-house">House</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select house" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house-a">House A</SelectItem>
                    <SelectItem value="house-b">House B</SelectItem>
                    <SelectItem value="house-c">House C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="feed-amount">Amount (kg)</Label>
                <Input
                  id="feed-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={feedAmount}
                  onChange={(e) => setFeedAmount(e.target.value)}
                />
              </div>

              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Submit Feed Log
              </Button>
            </CardContent>
          </Card>

          {/* Issue Reporting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Report Issue
              </CardTitle>
              <CardDescription>Report equipment problems or health concerns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="issue-type">Issue Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equipment">Equipment Problem</SelectItem>
                    <SelectItem value="health">Bird Health Concern</SelectItem>
                    <SelectItem value="safety">Safety Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="issue-description">Description</Label>
                <Textarea
                  id="issue-description"
                  placeholder="Describe the issue in detail..."
                  className="min-h-[100px]"
                />
              </div>

              <Button variant="destructive" className="w-full">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Submit Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
