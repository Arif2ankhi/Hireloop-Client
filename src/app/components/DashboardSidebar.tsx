"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/layout/logo";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bookmark,
  Building2,
  CreditCard,
  FileText,
  House,
  LayoutDashboard,
  type LucideIcon,
  Search,
  Settings,
  Users,
  Wallet,
  Briefcase,
  LogOut,
} from "lucide-react";
import Link from "next/link";

type UserRole = "seeker" | "recruiter" | "admin";

type MenuItem = {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
};

/** Links every role can see (public pages), per requirements sidebar spec. */
const publicLinks: MenuItem[] = [
  { id: "public-home", name: "Home", url: "/", icon: House },
  { id: "public-jobs", name: "Browse Jobs", url: "/browse-jobs", icon: Search },
  {
    id: "public-companies",
    name: "Companies",
    url: "/companies",
    icon: Building2,
  },
  { id: "public-pricing", name: "Pricing", url: "/pricing", icon: Wallet },
];

const menuItemsByRole: Record<UserRole, MenuItem[]> = {
  seeker: [
    { id: "home", name: "Home", url: "/dashboard/seeker", icon: LayoutDashboard },
    {
      id: "jobs",
      name: "Browse & Apply",
      url: "/dashboard/seeker/jobs",
      icon: Search,
    },
    {
      id: "saved",
      name: "Saved Jobs",
      url: "/dashboard/seeker/saved",
      icon: Bookmark,
    },
    {
      id: "applications",
      name: "My Applications",
      url: "/dashboard/seeker/applications",
      icon: FileText,
    },
    {
      id: "billing",
      name: "Subscription & Billing",
      url: "/dashboard/seeker/billing",
      icon: CreditCard,
    },
    {
      id: "settings",
      name: "Settings",
      url: "/dashboard/seeker/settings",
      icon: Settings,
    },
  ],

  recruiter: [
    {
      id: "home",
      name: "Home",
      url: "/dashboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      id: "company",
      name: "My Company",
      url: "/dashboard/recruiter/company",
      icon: Building2,
    },
    {
      id: "jobs",
      name: "Manage Jobs",
      url: "/dashboard/recruiter/jobs",
      icon: Briefcase,
    },
    {
      id: "billing",
      name: "Subscription & Billing",
      url: "/dashboard/recruiter/billing",
      icon: CreditCard,
    },
    {
      id: "settings",
      name: "Settings",
      url: "/dashboard/recruiter/settings",
      icon: Settings,
    },
  ],

  admin: [
    { id: "home", name: "Home", url: "/dashboard/admin", icon: LayoutDashboard },
    {
      id: "users",
      name: "Manage Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      id: "companies",
      name: "Manage Companies",
      url: "/dashboard/admin/companies",
      icon: Building2,
    },
    {
      id: "jobs",
      name: "Manage Jobs",
      url: "/dashboard/admin/jobs",
      icon: Briefcase,
    },
    {
      id: "payments",
      name: "Payment & Subscriptions",
      url: "/dashboard/admin/payments",
      icon: Wallet,
    },
    {
      id: "settings",
      name: "Settings",
      url: "/dashboard/admin/settings",
      icon: Settings,
    },
  ],
};

function MenuList({ items }: { items: MenuItem[] }) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton render={<Link href={item.url} />}>
            <item.icon />
            <span>{item.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function DashboardSidebar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const role: UserRole | undefined = isPending
    ? undefined
    : ((session?.user?.role as UserRole | undefined) || "seeker");

  const user = session?.user;
  const initials = (user?.name ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const handleSignOut = async () => {
    await signOut();
    // ends the session and redirects to the homepage (per requirements)
    router.push("/");
    router.refresh();
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/"
              aria-label="HireLoop home"
              className="flex h-12 items-center px-2"
            >
              <Logo />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Role-based navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>{role ? `${role} menu` : "Menu"}</SidebarGroupLabel>
          {role ? <MenuList items={menuItemsByRole[role]} /> : null}
        </SidebarGroup>

        {/* Public pages, available from the dashboard too */}
        <SidebarGroup>
          <SidebarGroupLabel>Explore</SidebarGroupLabel>
          <MenuList items={publicLinks} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {/* User info: Name, Avatar, Email, Role */}
          {user ? (
            <SidebarMenuItem>
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-brand/15 text-xs font-medium text-white">
                    {initials || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-zinc-400">
                    {user.email} · {role}
                  </p>
                </div>
              </div>
            </SidebarMenuItem>
          ) : null}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
