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
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Reservations", href: "/admin/reservations", icon: CalendarCheck },
  { label: "Preorders", href: "/admin/preorders", icon: Clock },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Design Families", href: "/admin/design-families", icon: Sparkles },
  { label: "Collections", href: "/admin/collections", icon: FolderTree },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Demand Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Store Settings", href: "/admin/settings", icon: Settings },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: History },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

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
          router.replace("/admin/login");
        } else {
          const data = await res.json();
          setUserEmail(data.user?.email || "admin@kapdology.store");
          setCheckingAuth(false);
        }
      } catch {
        router.replace("/admin/login");
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
      <div className="min-h-screen bg-[#0E1015] flex items-center justify-center font-mono text-xs text-white/70 uppercase tracking-widest">
        VERIFYING ADMIN PRIVILEGES...
      </div>
    );
  }

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

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
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
              <span className="block text-[10px] font-mono text-[#7B828F] truncate uppercase">
                {userEmail}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 font-mono">
                AUTHENTICATED
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-[#9AA0A6] hover:text-[#FF3B00] transition-colors p-1"
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#1A1E27] border border-[#262B36] rounded font-mono text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[#9AA0A6]">GATEWAY:</span>
              <span className="font-bold text-[#FF3B00]">PRE-RELEASE MODE</span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#FF3B00] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#e03400] transition-colors flex items-center gap-1.5"
            >
              <span>VIEW STORE</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#14171F] border-b border-[#262B36] p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-xs font-semibold ${
                    isActive ? "bg-[#FF3B00] text-white" : "text-[#9AA0A6] hover:bg-[#1E232E]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-[#262B36] flex justify-between items-center">
              <span className="text-xs font-mono text-[#7B828F]">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="text-xs font-mono font-bold text-[#FF3B00] uppercase"
              >
                LOGOUT
              </button>
            </div>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#0E1015]">
          {children}
        </main>

      </div>

    </div>
  );
}
