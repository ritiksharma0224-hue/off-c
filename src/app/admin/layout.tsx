"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Layers,
  Sparkles,
  FolderTree,
  CalendarCheck,
  Clock,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  BarChart3,
  Settings,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Crown,
} from "lucide-react";
import { AdminRole } from "@/lib/db/admins";

interface AdminUserSession {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  allowedRoles?: AdminRole[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
    allowedRoles: ["SUPER_ADMIN", "STORE_MANAGER", "CATALOG_EDITOR"],
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Boxes,
    allowedRoles: ["SUPER_ADMIN", "STORE_MANAGER", "ORDER_OPERATOR"],
  },
  {
    label: "Reservations",
    href: "/admin/reservations",
    icon: CalendarCheck,
    allowedRoles: ["SUPER_ADMIN", "STORE_MANAGER", "ORDER_OPERATOR"],
  },
  {
    label: "Preorders",
    href: "/admin/preorders",
    icon: Clock,
    allowedRoles: ["SUPER_ADMIN", "STORE_MANAGER", "ORDER_OPERATOR"],
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
    allowedRoles: ["SUPER_ADMIN", "STORE_MANAGER", "ORDER_OPERATOR"],
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Layers,
    allowedRoles: ["SUPER_ADMIN", "STORE_MANAGER", "CATALOG_EDITOR"],
  },
  {
    label: "Design Families",
    href: "/admin/design-families",
    icon: Sparkles,
    allowedRoles: ["SUPER_ADMIN", "STORE_MANAGER", "CATALOG_EDITOR"],
  },
  {
    label: "Collections",
    href: "/admin/collections",
    icon: FolderTree,
    allowedRoles: ["SUPER_ADMIN", "STORE_MANAGER", "CATALOG_EDITOR"],
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
    allowedRoles: ["SUPER_ADMIN", "STORE_MANAGER", "ORDER_OPERATOR"],
  },
  {
    label: "Media Library",
    href: "/admin/media",
    icon: ImageIcon,
    allowedRoles: ["SUPER_ADMIN", "STORE_MANAGER", "CATALOG_EDITOR"],
  },
  {
    label: "Demand Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    allowedRoles: ["SUPER_ADMIN", "STORE_MANAGER"],
  },
  {
    label: "Admins & Roles",
    href: "/admin/admins",
    icon: Shield,
    allowedRoles: ["SUPER_ADMIN"],
  },
  {
    label: "Store Settings",
    href: "/admin/settings",
    icon: Settings,
    allowedRoles: ["SUPER_ADMIN"],
  },
  {
    label: "Audit Logs",
    href: "/admin/audit-logs",
    icon: History,
    allowedRoles: ["SUPER_ADMIN"],
  },
];

const ROLE_BADGE: Record<
  string,
  { label: string; color: string; border: string; bg: string }
> = {
  SUPER_ADMIN: {
    label: "SUPER ADMIN",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/15",
  },
  ADMIN: {
    label: "SUPER ADMIN",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/15",
  },
  STORE_MANAGER: {
    label: "STORE MANAGER",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/15",
  },
  ORDER_OPERATOR: {
    label: "ORDER OPERATOR",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/15",
  },
  CATALOG_EDITOR: {
    label: "CATALOG EDITOR",
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/15",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<AdminUserSession | null>(null);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (!res.ok) {
          router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`);
        } else {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            setCheckingAuth(false);
          } else {
            router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`);
          }
        }
      } catch {
        router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`);
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0E1015] flex flex-col items-center justify-center font-mono text-xs text-white/70 space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF3B00] border-t-transparent animate-spin" />
        <span className="uppercase tracking-widest text-[#7B828F]">VERIFYING CREDENTIALS & POWERS...</span>
      </div>
    );
  }

  const roleMeta =
    (user?.role && ROLE_BADGE[user.role]) ? ROLE_BADGE[user.role] : ROLE_BADGE.SUPER_ADMIN;

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!user) return true;
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(user.role);
  });

  return (
    <div className="min-h-screen bg-[#0E1015] text-[#E4E6EB] flex font-sans select-none antialiased">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#14171F] border-r border-[#262B36] shrink-0 sticky top-0 h-screen z-30">
        
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#262B36]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#FF3B00] text-white font-black text-sm flex items-center justify-center shadow-[2px_2px_0px_#000]">
              K
            </div>
            <div>
              <span className="font-black tracking-wider text-sm text-white uppercase block leading-none">
                KAPDOLOGY®
              </span>
              <span className="font-mono text-[9px] text-[#FF3B00] font-bold tracking-widest block uppercase mt-0.5">
                ADMIN COCKPIT
              </span>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-black border border-emerald-500/20">
            PROD
          </span>
        </div>

        {/* Navigation Links (Filtered by Role) */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-[#FF3B00] text-white font-bold shadow-[2px_2px_0px_#000]"
                    : "text-[#9AA0A6] hover:bg-[#1E232E] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#7B828F]"}`} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Storefront & User Bar */}
        <div className="p-3 border-t border-[#262B36] space-y-2 bg-[#10131A]">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono font-bold uppercase text-[#9AA0A6] hover:text-white hover:bg-[#1E232E] rounded transition-colors"
          >
            <span>LIVE STOREFRONT</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="flex items-center justify-between px-3 py-2 bg-[#1A1E27] rounded border border-[#262B36]">
            <div className="truncate pr-2">
              <span className="block text-xs font-bold text-white truncate">
                {user?.name || "Admin"}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${roleMeta.bg} ${roleMeta.color} ${roleMeta.border}`}
                >
                  {roleMeta.label}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-[#9AA0A6] hover:text-[#FF3B00] transition-colors p-1 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 px-4 md:px-8 bg-[#14171F] border-b border-[#262B36] flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#9AA0A6] hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-[#7B828F]">
              <span className="text-white font-bold uppercase">KAPDOLOGY HQ</span>
              <span>/</span>
              <span className="text-[#FF3B00] uppercase font-bold">
                {pathname.replace("/admin", "").replace("/", "").toUpperCase() || "DASHBOARD"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-mono font-bold ${roleMeta.bg} ${roleMeta.color} ${roleMeta.border}`}
              >
                <Crown className="h-3 w-3" />
                <span>{roleMeta.label}</span>
              </div>
            )}

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 bg-[#FF3B00] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e03400] transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
            >
              <span>VIEW STORE</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm">
            <div className="w-64 h-full bg-[#14171F] border-r border-[#262B36] flex flex-col p-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#262B36] mb-4">
                <span className="font-bold text-white text-sm">KAPDOLOGY ADMIN</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-[#7B828F] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4 p-2.5 bg-[#1A1E27] rounded border border-[#262B36]">
                <div className="text-xs font-bold text-white truncate">{user?.name}</div>
                <div className={`text-[9px] font-mono font-bold mt-1 inline-block px-1.5 py-0.5 rounded border ${roleMeta.bg} ${roleMeta.color} ${roleMeta.border}`}>
                  {roleMeta.label}
                </div>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto">
                {visibleNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold ${
                        isActive
                          ? "bg-[#FF3B00] text-white"
                          : "text-[#9AA0A6] hover:bg-[#1E232E] hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full mt-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase rounded flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>LOGOUT</span>
              </button>
            </div>
          </div>
        )}

        {/* Child Pages Container */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>

      </div>
    </div>
  );
}
