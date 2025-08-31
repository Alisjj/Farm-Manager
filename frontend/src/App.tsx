import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Route, Switch } from "wouter";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import Dashboard from "./pages/Dashboard";
import DailyLogs from "./pages/DailyLogs";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import FeedManagement from "./pages/FeedManagement";
import LaborManagement from "./pages/LaborManagement";
import CostAnalysis from "./pages/CostAnalysis";
import Reports from "./pages/Reports";
import Houses from "./pages/houses";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/">
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Route>
            <Route path="/daily-logs">
              <ProtectedRoute>
                <DailyLogs />
              </ProtectedRoute>
            </Route>
            <Route path="/sales">
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            </Route>
            <Route path="/customers">
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            </Route>
            <Route path="/feed">
              <ProtectedRoute>
                <FeedManagement />
              </ProtectedRoute>
            </Route>
            <Route path="/labor">
              <ProtectedRoute requiredRole="owner">
                <LaborManagement />
              </ProtectedRoute>
            </Route>
            <Route path="/houses">
              <ProtectedRoute requiredRole="owner">
                <Houses />
              </ProtectedRoute>
            </Route>
            <Route path="/costs">
              <ProtectedRoute requiredRole="owner">
                <CostAnalysis />
              </ProtectedRoute>
            </Route>
            <Route path="/reports">
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            </Route>
            <Route>
              <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    404 - Page Not Found
                  </h1>
                  <p className="text-gray-600 mt-2">
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              </div>
            </Route>
          </Switch>
        </div>
        <Toaster />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
