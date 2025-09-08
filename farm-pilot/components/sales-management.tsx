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
import { DollarSign, Users, Plus, Search, Filter } from "lucide-react"

export function SalesManagement() {
  const [showNewSale, setShowNewSale] = useState(false)

  const recentSales = [
    {
      id: "S001",
      date: "2025-01-15",
      customer: "Lagos Restaurant",
      gradeA: 20,
      gradeB: 15,
      gradeC: 5,
      total: 24000,
      payment: "paid",
      method: "transfer",
    },
    {
      id: "S002",
      date: "2025-01-15",
      customer: "Mrs. Adebayo",
      gradeA: 5,
      gradeB: 3,
      gradeC: 2,
      total: 6000,
      payment: "pending",
      method: "cash",
    },
    {
      id: "S003",
      date: "2025-01-14",
      customer: "Sunshine Hotel",
      gradeA: 30,
      gradeB: 20,
      gradeC: 10,
      total: 36000,
      payment: "paid",
      method: "check",
    },
  ]

  const customers = [
    { id: "C001", name: "Lagos Restaurant", phone: "+234 801 234 5678", type: "Business" },
    { id: "C002", name: "Mrs. Adebayo", phone: "+234 802 345 6789", type: "Individual" },
    { id: "C003", name: "Sunshine Hotel", phone: "+234 803 456 7890", type: "Business" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-balance">Sales Management</h2>
          <p className="text-muted-foreground">Track sales, manage customers, and monitor payments</p>
        </div>
        <Button onClick={() => setShowNewSale(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Sale
        </Button>
      </div>

      {/* Sales Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦30,000</div>
            <p className="text-xs text-muted-foreground">+20% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dozens Sold</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40</div>
            <p className="text-xs text-muted-foreground">480 individual eggs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦6,000</div>
            <p className="text-xs text-muted-foreground">1 transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 new this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Form */}
        {showNewSale && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>New Sale Entry</CardTitle>
              <CardDescription>Record a new sale transaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Sale Date</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">Egg Quantities & Pricing</Label>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Grade A (dozens)</Label>
                    <Input type="number" placeholder="0" />
                    <Input type="number" placeholder="Price per dozen" />
                  </div>
                  <div className="space-y-2">
                    <Label>Grade B (dozens)</Label>
                    <Input type="number" placeholder="0" />
                    <Input type="number" placeholder="Price per dozen" />
                  </div>
                  <div className="space-y-2">
                    <Label>Grade C (dozens)</Label>
                    <Input type="number" placeholder="0" />
                    <Input type="number" placeholder="Price per dozen" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="transfer">Bank Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Record Sale</Button>
                <Button variant="outline" onClick={() => setShowNewSale(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Sales */}
        <Card className={showNewSale ? "lg:col-span-1" : "lg:col-span-3"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Latest sales transactions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Dozens</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                    <TableCell>{sale.gradeA + sale.gradeB + sale.gradeC}</TableCell>
                    <TableCell>₦{sale.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={sale.payment === "paid" ? "default" : "destructive"}>{sale.payment}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Customer Management */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>Manage your customer database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {customers.map((customer) => (
              <div key={customer.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{customer.name}</h4>
                  <Badge variant="outline">{customer.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    View Sales
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
