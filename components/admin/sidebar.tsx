"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Settings",
    items: [
      { name: "Site", href: "/admin/settings/site" },
      { name: "Visual", href: "/admin/settings/visual" },
      { name: "Contact", href: "/admin/settings/contact" },
      { name: "Social", href: "/admin/settings/social" },
    ],
  },
  {
    label: "Content",
    items: [
      { name: "Hero", href: "/admin/hero" },
      { name: "About", href: "/admin/about" },
      { name: "Skills", href: "/admin/skills" },
      { name: "Projects", href: "/admin/projects" },
    ],
  },
  {
    label: "Experience",
    items: [
      { name: "Experience", href: "/admin/experience" },
      { name: "Education", href: "/admin/education" },
      { name: "Certifications", href: "/admin/certifications" },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Import Sources", href: "/admin/imports/sources" },
      { name: "Import Logs", href: "/admin/imports/logs" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-slate-50 overflow-y-auto">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">[Portfolio Admin]</h2>
      </div>
      <nav className="p-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-200 text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
