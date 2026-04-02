"use client";
import { useState } from "react";
import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  User,
  LogOut,
  PanelLeft,
  History,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

const items = [
  { title: "Home", icon: Home },
  { title: "Inbox", icon: Inbox, badge: 4 },
  { title: "Calendar", icon: Calendar },
  { title: "Search", icon: Search },
  { title: "Settings", icon: Settings},
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Home");

  return (
    <aside
      style={{
        width: collapsed ? "64px" : "240px",
        transition: "width 220ms cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "'DM Sans', 'Geist', sans-serif",
      }}
      className="relative flex flex-col h-screen bg-zinc-900 border-r border-zinc-800 overflow-hidden shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-zinc-800 mt-16">
        {!collapsed && (
          <span
            className="text-white font-semibold text-sm tracking-wide truncate pl-1"
            style={{ opacity: collapsed ? 0 : 1, transition: "opacity 180ms" }}
          >
            ZecoAI
          </span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {!collapsed && (
          <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest px-2 pb-2 pt-1">
            Navigation
          </p>
        )}

        {items.map(({ title, icon: Icon, badge }) => {
          const isActive = active === title;
          return (
            <button
              key={title}
              onClick={() => setActive(title)}
              title={collapsed ? title : undefined}
              className={`
                group relative w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm
                transition-all duration-150 outline-none
                ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-300"
                    : "text-white/50 hover:text-white/90 hover:bg-white/[0.06]"
                }
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-400 rounded-full" />
              )}

              <Icon
                size={16}
                className={`shrink-0 ${isActive ? "text-indigo-400" : ""}`}
              />

              {!collapsed && (
                <span className="flex-1 text-left truncate">{title}</span>
              )}

              {!collapsed && badge && (
                <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / User Avatar Section */}
      <div className="border-t border-zinc-800 px-2 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "dark"
                }
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}