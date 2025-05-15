import * as React from "react"
import { useLocation } from "react-router-dom"
import {
  Home,
  Settings,
  FileText,
  MessageSquare,
  Layers,
  Folder,
  Users,
  Calendar,
  ChevronRight,
  LayoutGrid,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Data structure for navigation items
const createNavItems = (pathname) => [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    isActive: pathname === "/",
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
    isActive: pathname === "/documents",
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Folder,
    isActive: pathname === "/projects",
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
    isActive: pathname === "/messages",
  },
  {
    title: "Templates",
    url: "/templates",
    icon: Layers,
    isActive: pathname === "/templates",
  },
  {
    title: "Team",
    url: "/team",
    icon: Users,
    isActive: pathname === "/team",
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    isActive: pathname === "/calendar",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    isActive: pathname === "/settings",
  },
];

const userData = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

const teamsData = [
  {
    name: "Client Copywriter",
    logo: LayoutGrid,
    plan: "Enterprise",
  }
];

export function AppSidebar({
  ...props
}) {
  const location = useLocation();
  const navItems = React.useMemo(() => createNavItems(location.pathname), [location.pathname]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamsData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
