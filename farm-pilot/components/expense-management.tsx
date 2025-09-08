"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Receipt, Plus, Filter, Download, CalendarIcon, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"

interface ExpenseManagementProps {
  userRole?: "owner" | "staff"
}

export function ExpenseManagement({ userRole = "owner" }: ExpenseManagementProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)

  const expenseCategories = [
    "Feed & Nutrition",
    "Veterinary & Health",
    "Equipment & Maintenance",
    "Utilities",
    "Labor & Wages",
    "Transportation",
    "Marketing & Sales",
    "Administrative",
    "Other",
  ]

  const mockExpenses = [
    {
      id: 1,
      date: "2024-01-15",
      category: "Feed & Nutrition",
      description: "Layer feed - 50kg bags x 10",
      amount: 125000,
      status: userRole === "owner" ? "approved" : "pending",
      submittedBy: "John Doe",
      receipt: "receipt_001.pdf",
    },
    {
      id: 2,
      date: "2024-01-14",
      category: "Veterinary & Health",
      description: "Vaccination supplies",
      amount: 45000,
      status: "approved",
      submittedBy: "Jane Smith",
      receipt: "receipt_002.pdf",
    },
    {
      id: 3,
      date: "2024-01-13",
      category: "Equipment & Maintenance",
      description: "Feeder repair parts",
      amount: 18500,
      status: userRole === "owner" ? "rejected" : "pending",
      submittedBy: "Mike Johnson",
      receipt: null,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const pendingExpenses = mockExpenses.filter((e) => e.status === "pending").length
  const approvedExpenses = mockExpenses.filter((e) => e.status === "approved").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-balance">
            {userRole === "staff" ? "Log Expenses" : "Expense Management"}
          </h2>
          <p className="text-muted-foreground">
            {userRole === "staff"
              ? "Record and submit farm expenses for approval"
              : "Track, approve, and manage all farm expenses"}
          </p>
        </div>
        <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>Record a new farm expense with details and receipt.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, "-")}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input id="amount" type="number" placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the expense..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="receipt">Receipt (Optional)</Label>
                <Input id="receipt" type="file" accept="image/*,.pdf" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddExpenseOpen(false)}>
                {userRole === "staff" ? "Submit for Approval" : "Add Expense"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        {userRole === "owner" && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingExpenses}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedExpenses}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{Math.round(totalExpenses / 15).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 15 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Expense List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>
                {userRole === "staff"
                  ? "Your submitted expenses and their status"
                  : "All farm expenses requiring review and approval"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                {userRole === "owner" && <TableHead>Submitted By</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{format(new Date(expense.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{expense.description}</TableCell>
                  <TableCell className="font-medium">₦{expense.amount.toLocaleString()}</TableCell>
                  {userRole === "owner" && <TableCell>{expense.submittedBy}</TableCell>}
                  <TableCell>{getStatusBadge(expense.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {expense.receipt && (
                        <Button variant="ghost" size="sm">
                          View Receipt
                        </Button>
                      )}
                      {userRole === "owner" && expense.status === "pending" && (
                        <>
                          <Button variant="ghost" size="sm" className="text-green-600">
                            Approve
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
