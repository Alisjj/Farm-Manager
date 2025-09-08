"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserPlus, Calendar, DollarSign, Clock } from "lucide-react"

export function LaborManagement() {
  const [showNewWorker, setShowNewWorker] = useState(false)

  const workers = [
    {
      id: "W001",
      name: "John Doe",
      position: "General Laborer",
      salary: 45000,
      hireDate: "2024-06-15",
      phone: "+234 801 234 5678",
      status: "active",
      attendance: { present: 24, absent: 2, total: 26 },
    },
    {
      id: "W002",
      name: "Mary Jane",
      position: "Feed Specialist",
      salary: 50000,
      hireDate: "2024-08-01",
      phone: "+234 802 345 6789",
      status: "active",
      attendance: { present: 25, absent: 1, total: 26 },
    },
    {
      id: "W003",
      name: "Peter Paul",
      position: "General Laborer",
      salary: 42000,
      hireDate: "2024-09-10",
      phone: "+234 803 456 7890",
      status: "active",
      attendance: { present: 22, absent: 4, total: 26 },
    },
  ]

  const todayAssignments = [
    {
      worker: "John Doe",
      tasks: ["Egg Collection", "House Cleaning", "Equipment Maintenance"],
      status: "present",
      checkIn: "07:30",
      notes: "Completed all tasks efficiently",
    },
    {
      worker: "Mary Jane",
      tasks: ["Feed Preparation", "Feed Distribution", "Inventory Check"],
      status: "present",
      checkIn: "07:15",
      notes: "Excellent feed mixing today",
    },
    {
      worker: "Peter Paul",
      tasks: ["General Cleaning", "Waste Management"],
      status: "absent",
      checkIn: "-",
      notes: "Called in sick",
    },
  ]

  const payrollData = [
    {
      worker: "John Doe",
      baseSalary: 45000,
      daysWorked: 24,
      daysAbsent: 2,
      deductions: 3462,
      bonus: 0,
      finalPay: 41538,
      status: "pending",
    },
    {
      worker: "Mary Jane",
      baseSalary: 50000,
      daysWorked: 25,
      daysAbsent: 1,
      deductions: 1923,
      bonus: 2000,
      finalPay: 50077,
      status: "paid",
    },
    {
      worker: "Peter Paul",
      baseSalary: 42000,
      daysWorked: 22,
      daysAbsent: 4,
      deductions: 6462,
      bonus: 0,
      finalPay: 35538,
      status: "pending",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-balance">Labor Management</h2>
          <p className="text-muted-foreground">Manage workers, attendance, and payroll</p>
        </div>
        <Button onClick={() => setShowNewWorker(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Worker
        </Button>
      </div>

      {/* Labor Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workers.length}</div>
            <p className="text-xs text-muted-foreground">All active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAssignments.filter((a) => a.status === "present").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (todayAssignments.filter((a) => a.status === "present").length / todayAssignments.length) * 100,
              )}
              % attendance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{payrollData.reduce((sum, p) => sum + p.finalPay, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">January 2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollData.filter((p) => p.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Workers awaiting pay</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workers">Workers</TabsTrigger>
          <TabsTrigger value="attendance">Daily Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        {/* Workers Tab */}
        <TabsContent value="workers" className="space-y-6">
          {showNewWorker && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Worker</CardTitle>
                <CardDescription>Register a new employee</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Laborer</SelectItem>
                        <SelectItem value="feed">Feed Specialist</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input placeholder="+234 xxx xxx xxxx" />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Salary (₦)</Label>
                    <Input type="number" placeholder="45000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input placeholder="Enter address" />
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">Add Worker</Button>
                  <Button variant="outline" onClick={() => setShowNewWorker(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Worker Directory</CardTitle>
              <CardDescription>Manage your workforce</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workers.map((worker) => (
                  <div key={worker.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{worker.name}</div>
                      <div className="text-sm text-muted-foreground">{worker.position}</div>
                      <div className="text-sm text-muted-foreground">{worker.phone}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-medium">₦{worker.salary.toLocaleString()}/month</div>
                      <div className="text-sm text-muted-foreground">
                        Since {new Date(worker.hireDate).toLocaleDateString()}
                      </div>
                      <Badge variant={worker.status === "active" ? "default" : "secondary"}>{worker.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance & Assignments</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAssignments.map((assignment, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">{assignment.worker}</div>
                        <div className="text-sm text-muted-foreground">Check-in: {assignment.checkIn}</div>
                      </div>
                      <Badge variant={assignment.status === "present" ? "default" : "destructive"}>
                        {assignment.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Assigned Tasks:</Label>
                      <div className="flex flex-wrap gap-1">
                        {assignment.tasks.map((task, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {task}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {assignment.notes && (
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Notes:</Label>
                        <p className="text-sm text-muted-foreground">{assignment.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Payroll - January 2025</CardTitle>
              <CardDescription>Salary calculations and payment status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Days Worked</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead>Final Pay</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map((payroll, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{payroll.worker}</TableCell>
                      <TableCell>₦{payroll.baseSalary.toLocaleString()}</TableCell>
                      <TableCell>{payroll.daysWorked}/26</TableCell>
                      <TableCell className="text-destructive">-₦{payroll.deductions.toLocaleString()}</TableCell>
                      <TableCell className="text-chart-5">+₦{payroll.bonus.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">₦{payroll.finalPay.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={payroll.status === "paid" ? "default" : "destructive"}>{payroll.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Monthly Payroll</div>
                  <div className="text-2xl font-bold">
                    ₦{payrollData.reduce((sum, p) => sum + p.finalPay, 0).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Export Report</Button>
                  <Button>Process Payments</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
