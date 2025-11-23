import {
  Box,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  PackageOpen,
  User,
  UserPlus,
  Users,
  FileText,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
}

interface MenuSection {
  parent: string;
  children: MenuItem[];
}

// Menu items
const menuItems: MenuSection[] = [
  {
    parent: "Dashboard",
    children: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    parent: "Inventory",
    children: [
      {
        title: "Products",
        url: "/product",
        icon: Box,
      },
      {
        title: "Add Product",
        url: "/add-product",
        icon: PackageOpen,
      },
    ],
  },
  {
    parent: "Invoices",
    children: [
      {
        title: "All Invoices",
        url: "/invoices",
        icon: FileText,
      },
    ],
  },
  {
    parent: "Customers",
    children: [
      {
        title: "All Customers",
        url: "/customers",
        icon: Users,
      },
      {
        title: "Add Customer",
        url: "/add-customer",
        icon: UserPlus,
      },
    ],
  },
];

interface UserData {
  username: string;
  email: string;
}

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const userData: UserData | null = (() => {
    try {
      const stored = localStorage.getItem("gear-square-user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("gear-square-user");
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-gray-200 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-transparent">
              <div className="flex items-center gap-3 py-4">
                <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center shadow-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10"></div>
                  <div className="relative flex items-center justify-center">
                    <span className="font-black text-white text-lg">G</span>
                    <span className="font-black text-orange-400 text-lg -ml-0.5">S</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-gray-900 leading-tight">
                    Gear <span className="text-orange-500">Square</span>
                  </span>
                  <span className="text-xs text-gray-500">Auto Service</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="bg-white">
        <div className="px-3 py-4 space-y-6">
          {menuItems.map((section, index) => (
            <div key={index} className="space-y-2">
              <div className="px-3 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.parent}
                </span>
              </div>
              <SidebarMenu>
                {section.children.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`
                          group relative rounded-lg transition-all duration-200
                          ${
                            isActive
                              ? "bg-gray-900 text-white hover:bg-gray-800"
                              : "text-gray-700 hover:bg-gray-100"
                          }
                        `}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                          <item.icon
                            className={`w-5 h-5 ${isActive ? "text-gray-800" : "text-gray-600"}`}
                          />
                          <span className="font-medium text-sm">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          ))}
        </div>
      </SidebarContent>

      {/* Footer with User Profile */}
      <SidebarFooter className="border-t border-gray-200 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto py-3 px-3 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium text-sm text-gray-900 capitalize truncate">
                        {userData?.username || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userData?.email || "user@example.com"}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="right"
                align="end"
                className="w-64 bg-white border border-gray-200 shadow-lg rounded-lg p-2"
              >
                {/* User Info Header */}
                <div className="px-3 py-3 mb-2 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 capitalize truncate">
                        {userData?.username || "User"}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {userData?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-3 py-2.5 text-red-600 hover:bg-red-50 focus:bg-red-50 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  <span className="font-medium text-sm">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
