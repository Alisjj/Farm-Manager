import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "../../lib/utils";
import {
  Egg,
  CalendarCheck,
  Package,
  Users,
  DollarSign,
  BarChart3,
  Heart,
  Menu,
  X,
  CheckSquare,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";

// Management/Admin navigation
const managementNavigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Daily Activities", href: "/daily-logs", icon: CalendarCheck },
  { name: "Sales", href: "/sales", icon: DollarSign },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Feed Management", href: "/feed", icon: Package },
  { name: "Labor Management", href: "/labor", icon: Users },
  { name: "Cost Analysis", href: "/costs", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Health & Vet", href: "/health", icon: Heart },
  { name: "Houses", href: "/houses", icon: Package },
];

// Employee navigation
const employeeNavigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "My Tasks", href: "/my-tasks", icon: CheckSquare },
  { name: "Daily Activities", href: "/daily-logs", icon: CalendarCheck },
  { name: "Health & Vet", href: "/health", icon: Heart },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigation =
    user?.role === "owner" || user?.role === "staff"
      ? managementNavigation
      : employeeNavigation;

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 bg-white shadow-lg border-r border-slate-200 flex-shrink-0 overflow-y-auto z-40 transition-transform duration-200 ease-in-out",
          "lg:flex lg:flex-col",
          isMobileMenuOpen
            ? "fixed inset-y-0 left-0 translate-x-0"
            : "hidden lg:flex"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Egg className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Farm Manager
              </h1>
              <p className="text-xs text-slate-500">Egg Production</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
              <Users className="text-slate-600 w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.username}
              </p>
              <p className="text-xs text-slate-500 capitalize">
                {user?.role?.replace("_", " ") || "User"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;

            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  )}
                  onClick={closeMobileMenu}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}
