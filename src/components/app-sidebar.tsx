import {
  ChevronRight,
  ChevronUp,
  ListCheck,
  ListTodo,
  LogOut,
  PackageOpen,
  Tag,
  User,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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

// Menu items.
const items = [
  {
    title: "Products",
    url: "/product",
    icon: Tag,
  },
  {
    title: "Add product",
    url: "/add-product",
    icon: PackageOpen,
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: ListCheck,
  },
  {
    title: "Generate invoice",
    url: "/generate-invoice",
    icon: ListTodo,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  //@ts-ignore
  const data = JSON.parse(localStorage.getItem("gear-square-user"));
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-gray-200">
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div>
                <span className="px-[1px] border rounded-md font-semibold bg-orange-500">GS</span>
                <p className="font-bold text-2xl py-2 tracking-wide text-gray-600">
                  Ge<span className="text-orange-400">a</span>r Square
                </p>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-gray-300">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url ? true : false}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter className="bg-gray-100">
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="cursor-pointer">
              <div
                onClick={() => {
                  localStorage.removeItem("gear-square-user");
                  navigate("/");
                }}
              >
                <User />
                <span className="capitalize">{data.username}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> <span className="capitalize ">{data.username}</span>
                  <ChevronRight className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="left" className="w-full bg-gray-100">
                <DropdownMenuItem
                className="cursor-pointer"
                  onClick={() => {
                    localStorage.removeItem("gear-square-user");
                    navigate("/");
                  }}
                >
                 <LogOut /> <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
