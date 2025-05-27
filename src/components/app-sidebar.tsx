import {   ListTodo,  PackageOpen, Tag } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Link, useLocation } from "react-router-dom";

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
    title: "Generate invoice",
    url: "/generate-invoice",
    icon: ListTodo,
  },
];

export function AppSidebar() {
  const location = useLocation();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-gray-300">
        <SidebarHeader>
            <p className="font-bold text-2xl px-2 py-2 tracking-wide text-gray-600">
              Ge<span className="text-orange-400">a</span>r Square
            </p>
        </SidebarHeader>
        <SidebarGroup>
          {/* <hr className="text-gray-400"/> */}
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
    </Sidebar>
  );
}
