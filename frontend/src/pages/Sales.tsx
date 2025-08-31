import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Plus,
  Eye,
  Edit,
  CalendarDays,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";

export default function Sales() {
  const [activeTab, setActiveTab] = useState("overview");
  // const { data: salesData, isLoading: salesLoading } = useSalesAnalytics();

  // Mock data for demonstration
  const recentSales = [
    {
      id: 1,
      customer: "Fresh Market Co.",
      date: "2025-08-31",
      eggs: 480,
      grade: "Grade A",
      pricePerEgg: 0.25,
      total: 120.0,
      status: "Completed",
    },
    {
      id: 2,
      customer: "Local Bakery",
      date: "2025-08-31",
      eggs: 240,
      grade: "Grade A",
      pricePerEgg: 0.22,
      total: 52.8,
      status: "Pending",
    },
    {
      id: 3,
      customer: "Restaurant Supply",
      date: "2025-08-30",
      eggs: 720,
      grade: "Grade B",
      pricePerEgg: 0.18,
      total: 129.6,
      status: "Completed",
    },
  ];

  const salesKPIs = {
    todaysSales: 172.8,
    weeklyTotal: 1250.0,
    monthlyTotal: 5480.0,
    totalCustomers: 12,
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <TopHeader
          title="Sales Management"
          subtitle="Record daily sales transactions and manage customer relationships"
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Sales Overview</TabsTrigger>
              <TabsTrigger value="record">Record Sale</TabsTrigger>
              <TabsTrigger value="history">Sales History</TabsTrigger>
            </TabsList>

            {/* Sales Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Today's Sales
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${salesKPIs.todaysSales}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +12.5% from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Weekly Total
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${salesKPIs.weeklyTotal}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +8.2% from last week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Monthly Total
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${salesKPIs.monthlyTotal}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +15.1% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Customers
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {salesKPIs.totalCustomers}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +2 new this month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Sales */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    Your latest sales transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSales.map((sale) => (
                      <div
                        key={sale.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{sale.customer}</p>
                            <p className="text-sm text-muted-foreground">
                              {sale.eggs} eggs • {sale.grade}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${sale.total}</p>
                          <p className="text-sm text-muted-foreground">
                            {sale.date}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              sale.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {sale.status}
                          </span>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Record Sale Tab */}
            <TabsContent value="record" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Record New Sale</CardTitle>
                  <CardDescription>
                    Add a new sales transaction to the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="customer">Customer</Label>
                      <Input
                        id="customer"
                        placeholder="Select or add customer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Sale Date</Label>
                      <Input id="date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eggs">Number of Eggs</Label>
                      <Input
                        id="eggs"
                        type="number"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Egg Grade</Label>
                      <Input id="grade" placeholder="Grade A, B, or C" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Egg</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total">Total Amount</Label>
                      <Input
                        id="total"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Record Sale
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sales History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Sales History</CardTitle>
                      <CardDescription>
                        Complete record of all sales transactions
                      </CardDescription>
                    </div>
                    <Button variant="outline">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Filter by Date
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSales.concat(recentSales).map((sale, index) => (
                      <div
                        key={`history-${sale.id}-${index}`}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{sale.customer}</p>
                            <p className="text-sm text-muted-foreground">
                              {sale.eggs} eggs • {sale.grade} • $
                              {sale.pricePerEgg}/egg
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${sale.total}</p>
                          <p className="text-sm text-muted-foreground">
                            {sale.date}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              sale.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {sale.status}
                          </span>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
