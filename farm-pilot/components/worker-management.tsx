"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Filter, Clock, Users, CheckCircle, Timer, Target } from "lucide-react"

export function WorkerManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedShift, setSelectedShift] = useState("all")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isLogWorkOpen, setIsLogWorkOpen] = useState(false)

  const workers = [
    {
      id: 1,
      name: "John Adebayo",
      shift: "Morning",
      department: "Egg Collection",
      status: "present",
      todayTasks: 3,
      completedTasks: 2,
      hoursWorked: 6.5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Mary Okonkwo",
      shift: "Morning",
      department: "Feed Distribution",
      status: "present",
      todayTasks: 4,
      completedTasks: 4,
      hoursWorked: 7.0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Ibrahim Musa",
      shift: "Evening",
      department: "Cleaning",
      status: "absent",
      todayTasks: 2,
      completedTasks: 0,
      hoursWorked: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Grace Eze",
      shift: "Morning",
      department: "Quality Check",
      status: "present",
      todayTasks: 3,
      completedTasks: 1,
      hoursWorked: 4.0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const todayTasks = [
    {
      id: 1,
      task: "Collect eggs from House A",
      assignedTo: "John Adebayo",
      priority: "high",
      status: "completed",
      timeLogged: "2 hours",
      notes: "Collected 450 eggs, all Grade A",
    },
    {
      id: 2,
      task: "Feed distribution - Morning batch",
      assignedTo: "Mary Okonkwo",
      priority: "high",
      status: "completed",
      timeLogged: "1.5 hours",
      notes: "Distributed 50kg feed mix",
    },
    {
      id: 3,
      task: "Clean House B",
      assignedTo: "Ibrahim Musa",
      priority: "medium",
      status: "pending",
      timeLogged: "0 hours",
      notes: "Worker absent today",
    },
    {
      id: 4,
      task: "Quality check - Grade sorting",
      assignedTo: "Grace Eze",
      priority: "medium",
      status: "in-progress",
      timeLogged: "1 hour",
      notes: "Currently sorting morning collection",
    },
  ]

  const shifts = ["all", "Morning", "Evening", "Night"]

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesShift = selectedShift === "all" || worker.shift === selectedShift
    return matchesSearch && matchesShift
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>
      case "absent":
        return <Badge variant="destructive">Absent</Badge>
      case "late":
        return <Badge variant="secondary">Late</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Worker Management</h2>
          <p className="text-muted-foreground">Manage daily tasks and track worker activities</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Assign Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Assign New Task</DialogTitle>
                <DialogDescription>Assign a new task to a worker.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task" className="text-right">
                    Task
                  </Label>
                  <Input id="task" className="col-span-3" placeholder="e.g., Collect eggs from House A" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="worker" className="text-right">
                    Worker
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select worker" />
                    </SelectTrigger>
                    <SelectContent>
                      {workers
                        .filter((w) => w.status === "present")
                        .map((worker) => (
                          <SelectItem key={worker.id} value={worker.name}>
                            {worker.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea id="notes" className="col-span-3" placeholder="Additional instructions..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddTaskOpen(false)}>Assign Task</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isLogWorkOpen} onOpenChange={setIsLogWorkOpen}>
            <DialogTrigger asChild>
              <Button>
                <Timer className="mr-2 h-4 w-4" />
                Log Work
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Log Worker Activity</DialogTitle>
                <DialogDescription>Record completed work and time spent.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="worker-select" className="text-right">
                    Worker
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select worker" />
                    </SelectTrigger>
                    <SelectContent>
                      {workers.map((worker) => (
                        <SelectItem key={worker.id} value={worker.name}>
                          {worker.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-select" className="text-right">
                    Task
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select task" />
                    </SelectTrigger>
                    <SelectContent>
                      {todayTasks.map((task) => (
                        <SelectItem key={task.id} value={task.task}>
                          {task.task}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hours" className="text-right">
                    Hours
                  </Label>
                  <Input id="hours" type="number" step="0.5" className="col-span-3" placeholder="2.5" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="work-notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="work-notes"
                    className="col-span-3"
                    placeholder="Work completed, issues encountered..."
                  />
                </div>
                <div className="flex items-center space-x-2 col-span-4">
                  <Checkbox id="completed" />
                  <Label htmlFor="completed">Mark task as completed</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsLogWorkOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsLogWorkOpen(false)}>Log Work</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">out of 4 workers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">out of 12 assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Worked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17.5</div>
            <p className="text-xs text-muted-foreground">total today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">task completion rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workers">Workers</TabsTrigger>
          <TabsTrigger value="tasks">Today's Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="workers" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                {shifts.slice(1).map((shift) => (
                  <SelectItem key={shift} value={shift}>
                    {shift}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Workers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Workers</CardTitle>
              <CardDescription>Track worker attendance and task progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tasks Progress</TableHead>
                    <TableHead>Hours Worked</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={worker.avatar || "/placeholder.svg"} alt={worker.name} />
                            <AvatarFallback>
                              {worker.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{worker.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{worker.shift}</Badge>
                      </TableCell>
                      <TableCell>{worker.department}</TableCell>
                      <TableCell>{getStatusBadge(worker.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {worker.completedTasks}/{worker.todayTasks} completed
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{worker.hoursWorked}h</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
              <CardDescription>Monitor and update task progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time Logged</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.task}</TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell>{getTaskStatusBadge(task.status)}</TableCell>
                      <TableCell>{task.timeLogged}</TableCell>
                      <TableCell className="max-w-xs truncate">{task.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
