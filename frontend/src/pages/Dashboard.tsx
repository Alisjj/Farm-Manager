import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "wouter";
import { useSalesAnalytics } from "../hooks/useSales";
import { useCustomerSummary } from "../hooks/useCustomers";
import { useDailyLogs } from "../hooks/useDailyLogs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Egg,
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Package,
  Heart,
  FileText,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Use our API hooks to fetch data
  const { data: salesData, isLoading: salesLoading } = useSalesAnalytics();
  const { data: customerData, isLoading: customerLoading } =
    useCustomerSummary();
  const { data: dailyLogsData, isLoading: dailyLogsLoading } = useDailyLogs({
    limit: 5, // Get recent logs
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isOwner = user.role === "owner";
  const todayEggs = dailyLogsData?.data?.[0]
    ? dailyLogsData.data[0].morningEggs + dailyLogsData.data[0].afternoonEggs
    : 0;
  const mortality = dailyLogsData?.data?.[0]?.mortality || 0;
  const showMortalityAlert = mortality > 5;

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <TopHeader
          title="Dashboard"
          subtitle="Welcome to your egg production management system"
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600 mt-1">
              Welcome to your egg production management system
            </p>
          </div>

          {/* High Mortality Alert */}
          {showMortalityAlert && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <p className="text-red-800 font-medium">
                    High Mortality Alert
                  </p>
                  <p className="text-red-700">
                    Mortality exceeded threshold ({mortality} birds today).
                    Immediate attention required.
                  </p>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  View Details
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Dashboard Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Farm Overview</TabsTrigger>
              {isOwner && (
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              )}
              <TabsTrigger value="operations">Operations</TabsTrigger>
            </TabsList>

            {/* Farm Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Today's Production
                    </CardTitle>
                    <Egg className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dailyLogsLoading ? "..." : todayEggs}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      eggs collected
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₦
                      {salesLoading
                        ? "..."
                        : salesData?.totalRevenue?.toLocaleString() || "0"}
                    </div>
                    <p className="text-xs text-muted-foreground">total sales</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Customers
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {customerLoading
                        ? "..."
                        : customerData?.totalCustomers || "0"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ({customerData?.activeCustomers || "0"} active)
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Mortality Rate
                    </CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mortality}</div>
                    <p className="text-xs text-muted-foreground">birds today</p>
                  </CardContent>
                </Card>
              </div>

              {/* Production Chart Section */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Egg Production Trends
                      </CardTitle>
                      <CardDescription>
                        Last 7 days production overview
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Production Chart</p>
                          <p className="text-xs text-gray-400">
                            Real-time data visualization coming soon
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dailyLogsLoading ? (
                        <div className="text-center py-4">
                          <p className="text-gray-500 text-sm">Loading...</p>
                        </div>
                      ) : dailyLogsData?.data &&
                        dailyLogsData.data.length > 0 ? (
                        dailyLogsData.data.slice(0, 3).map((log, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                Daily log for House {log.houseId}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(log.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500 text-sm">
                            No recent activities
                          </p>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => handleNavigation("/daily-logs")}
                    >
                      View All Activities
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab (Owner only) */}
            {isOwner && (
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Revenue Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        +12.5%
                      </div>
                      <p className="text-xs text-gray-500">vs last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Feed Conversion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2.1</div>
                      <p className="text-xs text-gray-500">
                        kg feed per kg eggs
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Profit Margin</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        35.2%
                      </div>
                      <p className="text-xs text-gray-500">current period</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Advanced Analytics Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Overview</CardTitle>
                      <CardDescription>
                        Revenue, expenses, and profitability analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Revenue</span>
                          <span className="font-medium text-green-600">
                            ₦{salesData?.totalRevenue?.toLocaleString() || "0"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Operating Costs</span>
                          <span className="font-medium text-red-600">
                            ₦
                            {Math.floor(
                              (salesData?.totalRevenue || 0) * 0.65
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t pt-2 flex justify-between">
                          <span className="text-sm font-medium">
                            Net Profit
                          </span>
                          <span className="font-bold text-blue-600">
                            ₦
                            {Math.floor(
                              (salesData?.totalRevenue || 0) * 0.35
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Production Efficiency</CardTitle>
                      <CardDescription>
                        Key performance indicators
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm">Daily Avg Production</span>
                          <span className="font-medium">
                            {Math.round(todayEggs * 0.95)} eggs
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Quality Grade A</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Collection Efficiency</span>
                          <span className="font-medium">96%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}

            {/* Operations Tab */}
            <TabsContent value="operations" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleNavigation("/daily-logs")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Egg className="h-5 w-5 mr-2" />
                      Daily Operations
                    </CardTitle>
                    <CardDescription>
                      Log daily egg collection, feed consumption, and health
                      observations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Enter Daily Data</Button>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleNavigation("/sales")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Sales Management
                    </CardTitle>
                    <CardDescription>
                      Record sales transactions and manage customer
                      relationships
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Record Sale</Button>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleNavigation("/feed")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      Feed Management
                    </CardTitle>
                    <CardDescription>
                      Create feed batches and calculate production costs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Manage Feed</Button>
                  </CardContent>
                </Card>

                {isOwner && (
                  <>
                    <Card
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleNavigation("/labor")}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          Labor Management
                        </CardTitle>
                        <CardDescription>
                          Manage workers, track attendance, and process payroll
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">Manage Staff</Button>
                      </CardContent>
                    </Card>

                    <Card
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleNavigation("/costs")}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2" />
                          Cost Analysis
                        </CardTitle>
                        <CardDescription>
                          Analyze production costs and pricing recommendations
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">View Analysis</Button>
                      </CardContent>
                    </Card>

                    <Card
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleNavigation("/reports")}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          Reports
                        </CardTitle>
                        <CardDescription>
                          Generate comprehensive reports and analytics
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">View Reports</Button>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
