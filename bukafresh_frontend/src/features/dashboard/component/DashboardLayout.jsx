import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Truck,
  History,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  ChevronRight,
  User,
  CreditCard,
} from "lucide-react";
import { Button } from "@/shared/ui/buttons";
import { useAuth } from "@/auth/api/AuthProvider";
import { useUserProfile } from "@/auth/api/useUserProfile";
import { cn } from "@/shared/utils/cn";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Subscription", href: "/dashboard/subscription", icon: Package },
  { label: "Deliveries", href: "/dashboard/deliveries", icon: Truck },
  { label: "Order History", href: "/dashboard/orders", icon: History },
  { label: "Shop Add-ons", href: "/dashboard/shop", icon: ShoppingCart },
  { label: "Payment & Billing", href: "/dashboard/payment", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (href) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16 flex items-center px-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 text-foreground"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link to="/" className="flex items-center gap-2 mx-auto">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold">
            Buka<span className="text-primary">Fresh</span>
          </span>
        </Link>

        <div className="w-10" />
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/50 z-50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-background border-r border-border z-50 transform transition-transform duration-200 ease-in-out",
          "lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold">
              Buka<span className="text-primary">Fresh</span>
            </span>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-border">
          {profileLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted animate-pulse"></div>
              <div>
                <div className="h-4 bg-muted rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
              </div>
            </div>
          ) : profileError ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <User className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-foreground">Profile Error</p>
                <p className="text-sm text-muted-foreground">
                  Failed to load profile
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-lg">
                  {profile?.data?.firstName?.[0] || "U"}
                  {profile?.data?.lastName?.[0] || ""}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {profile?.data?.fullName || "User"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {localStorage.getItem("userEmail") || "user@example.com"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
