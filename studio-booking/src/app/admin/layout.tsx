"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/packages", label: "Paket" },
  { href: "/admin/gallery", label: "Gallery" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-stone-950 flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </span>
            <span className="text-white font-semibold text-sm">wanpicture</span>
          </div>
          <p className="text-stone-500 text-xs mt-1">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-amber-400 text-stone-900"
                    : "text-stone-400 hover:text-white hover:bg-stone-800"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-stone-800">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-stone-500 hover:text-red-400 hover:bg-stone-900 transition-colors"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
