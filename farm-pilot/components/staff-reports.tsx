"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, TrendingUp, Egg, Package, Clock, Award, Target, BarChart3 } from "lucide-react"

export function StaffReports() {
  const weeklyStats = {
    eggsCollected: 8750,
    feedDistributed: 595,
    tasksCompleted: 28,
    totalTasks: 30,
    avgCollectionTime: "45 min",
    efficiency: 93,
  }

  const dailyPerformance = [
    { day: "Monday", eggs: 1250, feed: 85, tasks: 4, efficiency: 95 },
    { day: "Tuesday", eggs: 1180, feed: 90, tasks: 4, efficiency: 88 },
    { day: "Wednesday", eggs: 1320, feed: 85, tasks: 4, efficiency: 98 },
    { day: "Thursday", eggs: 1200, feed: 88, tasks: 4, efficiency: 92 },
    { day: "Friday", eggs: 1280, feed: 87, tasks: 4, efficiency: 96 },
    { day: "Saturday", eggs: 1260, feed: 85, tasks: 4, efficiency: 94 },
    { day: "Sunday", eggs: 1260, feed: 90, tasks: 4, efficiency: 91 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-balance">My Performance</h2>
          <p className="text-muted-foreground">Your work summary and achievements</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Calendar className="h-4 w-4 mr-1" />
          This Week
        </Badge>
      </div>

      {/* Weekly Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eggs Collected</CardTitle>
            <Egg className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.eggsCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feed Distributed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.feedDistributed}kg</div>
            <p className="text-xs text-muted-foreground">Target: 630kg weekly</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weeklyStats.tasksCompleted}/{weeklyStats.totalTasks}
            </div>
            <Progress value={(weeklyStats.tasksCompleted / weeklyStats.totalTasks) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.efficiency}%</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="inline h-3 w-3 mr-1" />
              Avg: {weeklyStats.avgCollectionTime}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Daily Performance This Week
          </CardTitle>
          <CardDescription>Your daily work summary and efficiency metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyPerformance.map((day, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{day.day}</h4>
                  <Badge variant={day.efficiency >= 95 ? "default" : day.efficiency >= 90 ? "secondary" : "outline"}>
                    {day.efficiency}% Efficiency
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Egg className="h-4 w-4 text-muted-foreground" />
                    <span>{day.eggs} eggs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{day.feed}kg feed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>{day.tasks}/4 tasks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
          <CardDescription>Your accomplishments and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Perfect Week</p>
                <p className="text-sm text-muted-foreground">Completed all assigned tasks this week</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Efficiency Champion</p>
                <p className="text-sm text-muted-foreground">Maintained 90%+ efficiency for 2 weeks</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Egg className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Collection Expert</p>
                <p className="text-sm text-muted-foreground">Collected 50,000+ eggs this month</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
