"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Egg, Package, AlertTriangle, TrendingUp, Calendar, Target } from "lucide-react"

export function StaffDashboard() {
  const todaysTasks = [
    { id: 1, task: "Morning egg collection - House A", status: "completed", time: "6:00 AM" },
    { id: 2, task: "Feed House B", status: "completed", time: "7:30 AM" },
    { id: 3, task: "Afternoon egg collection - House A", status: "pending", time: "2:00 PM" },
    { id: 4, task: "Clean water systems", status: "pending", time: "4:00 PM" },
  ]

  const myStats = {
    eggsCollected: 1247,
    feedDistributed: 85,
    tasksCompleted: 12,
    attendance: 95,
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-balance">Good morning, Sarah!</h2>
          <p className="text-muted-foreground">Here's your daily overview and tasks</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eggs Collected Today</CardTitle>
            <Egg className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myStats.eggsCollected}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feed Distributed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myStats.feedDistributed}kg</div>
            <p className="text-xs text-muted-foreground">Target: 90kg daily</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks This Week</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myStats.tasksCompleted}/15</div>
            <Progress value={(myStats.tasksCompleted / 15) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myStats.attendance}%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Tasks</CardTitle>
          <CardDescription>Your assigned tasks for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaysTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {task.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-orange-500" />
                  )}
                  <div>
                    <p
                      className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.task}
                    </p>
                    <p className="text-sm text-muted-foreground">{task.time}</p>
                  </div>
                </div>
                <Badge variant={task.status === "completed" ? "default" : "secondary"}>
                  {task.status === "completed" ? "Done" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <Egg className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Log Egg Collection</div>
                <div className="text-sm text-muted-foreground">Record today's harvest</div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <Package className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Record Feed Usage</div>
                <div className="text-sm text-muted-foreground">Log feed distribution</div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Report Issue</div>
                <div className="text-sm text-muted-foreground">Equipment or health concerns</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
