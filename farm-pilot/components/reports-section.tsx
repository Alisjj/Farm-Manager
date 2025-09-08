"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Calendar, TrendingUp, BarChart3, PieChart, FileSpreadsheet } from "lucide-react"

export function ReportsSection() {
  const [dateRange, setDateRange] = useState("last-30-days")
  const [reportType, setReportType] = useState("production")

  const productionSummary = {
    totalEggs: 12600,
    avgDaily: 420,
    gradeAPercent: 65,
    gradeBPercent: 25,
    gradeCPercent: 10,
    efficiency: 94.2,
  }

  const salesSummary = {
    totalRevenue: 450000,
    totalDozens: 1050,
    avgPricePerDozen: 428.57,
    paidTransactions: 28,
    pendingTransactions: 3,
  }

  const costSummary = {
    totalFeedCost: 107100,
    totalLaborCost: 35280,
    totalFixedCosts: 18900,
    avgCostPerEgg: 13.5,
    profitMargin: 20.6,
  }

  const weeklyData = [
    { week: "Week 1", production: 2940, sales: 126000, profit: 35280 },
    { week: "Week 2", production: 2835, sales: 121500, profit: 33615 },
    { week: "Week 3", production: 3045, sales: 130500, profit: 36855 },
    { week: "Week 4", production: 3150, sales: 135000, profit: 38250 },
    { week: "Week 5", production: 630, sales: 27000, profit: 7650 },
  ]

  const topCustomers = [
    { name: "Lagos Restaurant", orders: 8, revenue: 96000, avgOrder: 12000 },
    { name: "Sunshine Hotel", orders: 6, revenue: 72000, avgOrder: 12000 },
    { name: "Fresh Market", orders: 5, revenue: 45000, avgOrder: 9000 },
    { name: "Mrs. Adebayo", orders: 12, revenue: 36000, avgOrder: 3000 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-balance">Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive business insights and data export</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production Report</SelectItem>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                  <SelectItem value="labor">Labor Report</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Production</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productionSummary.totalEggs.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{productionSummary.avgDaily} eggs/day average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{salesSummary.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{salesSummary.totalDozens} dozens sold</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{costSummary.profitMargin}%</div>
                <p className="text-xs text-muted-foreground">Above industry average</p>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance Summary</CardTitle>
              <CardDescription>Production, sales, and profit trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Production (eggs)</TableHead>
                    <TableHead>Sales Revenue</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Efficiency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weeklyData.map((week) => (
                    <TableRow key={week.week}>
                      <TableCell className="font-medium">{week.week}</TableCell>
                      <TableCell>{week.production.toLocaleString()}</TableCell>
                      <TableCell>₦{week.sales.toLocaleString()}</TableCell>
                      <TableCell className="text-chart-5">₦{week.profit.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="default">
                          {((week.production / (week.week === "Week 5" ? 1050 : 3150)) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Production Tab */}
        <TabsContent value="production" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Eggs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productionSummary.totalEggs.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Grade A</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productionSummary.gradeAPercent}%</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((productionSummary.totalEggs * productionSummary.gradeAPercent) / 100).toLocaleString()}{" "}
                  eggs
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Grade B</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productionSummary.gradeBPercent}%</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((productionSummary.totalEggs * productionSummary.gradeBPercent) / 100).toLocaleString()}{" "}
                  eggs
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productionSummary.efficiency}%</div>
                <div className="text-xs text-muted-foreground">Overall performance</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>House Performance Comparison</CardTitle>
              <CardDescription>Production efficiency by house/coop</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { house: "House A", production: 4200, capacity: 4500, efficiency: 93.3 },
                  { house: "House B", production: 4050, capacity: 4500, efficiency: 90.0 },
                  { house: "House C", production: 4350, capacity: 4500, efficiency: 96.7 },
                ].map((house) => (
                  <div key={house.house} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{house.house}</div>
                      <div className="text-sm text-muted-foreground">
                        {house.production.toLocaleString()} / {house.capacity.toLocaleString()} eggs
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge
                        variant={
                          house.efficiency > 95 ? "default" : house.efficiency > 90 ? "secondary" : "destructive"
                        }
                      >
                        {house.efficiency}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{salesSummary.totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Dozens Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesSummary.totalDozens}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Price/Dozen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{salesSummary.avgPricePerDozen.toFixed(0)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (salesSummary.paidTransactions /
                      (salesSummary.paidTransactions + salesSummary.pendingTransactions)) *
                      100,
                  )}
                  %
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Best performing customers by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Avg Order</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCustomers.map((customer) => (
                    <TableRow key={customer.name}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>₦{customer.revenue.toLocaleString()}</TableCell>
                      <TableCell>₦{customer.avgOrder.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={customer.avgOrder > 10000 ? "default" : "secondary"}>
                          {customer.avgOrder > 10000 ? "Business" : "Individual"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Feed Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{costSummary.totalFeedCost.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">63% of total costs</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Labor Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{costSummary.totalLaborCost.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">21% of total costs</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fixed Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{costSummary.totalFixedCosts.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">11% of total costs</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cost per Egg</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{costSummary.avgCostPerEgg}</div>
                <div className="text-xs text-muted-foreground">All costs included</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Summary</CardTitle>
              <CardDescription>Financial performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Total Revenue</span>
                  <span className="text-lg font-bold text-chart-5">₦{salesSummary.totalRevenue.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Total Costs</span>
                  <span className="text-lg font-bold text-destructive">
                    ₦
                    {(
                      costSummary.totalFeedCost +
                      costSummary.totalLaborCost +
                      costSummary.totalFixedCosts
                    ).toLocaleString()}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <span className="text-lg font-medium">Net Profit</span>
                  <span className="text-2xl font-bold text-primary">
                    ₦
                    {(
                      salesSummary.totalRevenue -
                      (costSummary.totalFeedCost + costSummary.totalLaborCost + costSummary.totalFixedCosts)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Quick Export Options
          </CardTitle>
          <CardDescription>Generate and download reports instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Production Report (PDF)
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Sales Data (Excel)
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Financial Summary (PDF)
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              All Data (CSV)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
