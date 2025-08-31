import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Sidebar from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";

const createPageStub =
  (title: string, description: string, subtitle?: string) => () =>
    (
      <div className="h-screen flex bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <TopHeader title={title} subtitle={subtitle || description} />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Card>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{description}</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );

export const Customers = createPageStub(
  "Customer Management",
  "Manage customer database and relationships",
  "Track customer information, preferences, and purchase history"
);
export const FeedManagement = createPageStub(
  "Feed Management",
  "Create feed batches and calculate production costs",
  "Manage feed inventory, recipes, and cost optimization"
);
export const LaborManagement = createPageStub(
  "Labor Management",
  "Manage workers, track attendance, and process payroll",
  "Employee management, scheduling, and payroll processing"
);
export const CostAnalysis = createPageStub(
  "Cost Analysis",
  "Analyze production costs and pricing recommendations",
  "Comprehensive cost analysis and profitability insights"
);
export const Reports = createPageStub(
  "Reports",
  "Generate comprehensive reports and analytics",
  "Business intelligence and reporting dashboard"
);

export default Customers;
