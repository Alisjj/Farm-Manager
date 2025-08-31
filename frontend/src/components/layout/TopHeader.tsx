import { Bell, Calendar, LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useAuth } from "../../context/AuthContext";

interface TopHeaderProps {
  title: string;
  subtitle?: string;
}

export default function TopHeader({ title, subtitle }: TopHeaderProps) {
  const { user, logout } = useAuth();

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 lg:gap-0">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 truncate">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative h-8 w-8 sm:h-10 sm:w-10"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* Date Display */}
          <div className="hidden md:flex items-center text-xs sm:text-sm text-slate-600">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="truncate">{currentDate}</span>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 sm:space-x-2 h-8 sm:h-10 px-2 sm:px-3"
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline text-xs sm:text-sm truncate max-w-20 lg:max-w-none">
                  {user?.username}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <div className="px-2 py-1.5 text-sm">
                <div className="font-medium truncate">{user?.username}</div>
                <div className="text-xs text-slate-400 capitalize">
                  {user?.role?.replace("_", " ")}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
