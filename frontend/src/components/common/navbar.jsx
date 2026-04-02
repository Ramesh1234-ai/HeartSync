import {
  Code2,
  Bell,
  Settings,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor/');

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-900 border-b border-zinc-800"
      style={{
        fontFamily: "'DM Sans', 'Geist', sans-serif",
      }}
    >
      <nav className="flex items-center justify-between px-6 py-4 h-16">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          {isEditor && (
            <Link 
              to="/projects"
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-white/60 hover:text-white"
              title="Back to Projects"
            >
              <ArrowLeft size={18} />
            </Link>
          )}
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Code2 size={20} className="text-indigo-400" />
          </div>
          <span className="font-bold text-white text-lg">ZecoAI</span>
        </div>
        {/* Center - Navigation items (Optional) */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
            Dashboard
          </a>
          <Link to="/projects" className="text-white/60 hover:text-white text-sm transition-colors">
            Projects
          </Link>
          <Link to="/history" className="text-white/60 hover:text-white text-sm transition-colors">
            history
          </Link>
          <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
            Help
          </a>
        </div>

        {/* Right - Actions & Avatar */}
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <button className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors">
            <Bell size={18} />
          </button>

          {/* Message Icon */}
          <button className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors">
            <MessageCircle size={18} />
          </button>

          {/* Settings Icon */}
          <button className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors">
            <Settings size={18} />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-zinc-700"></div>

          {/* User Avatar */}
          <div className="flex items-center">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: "dark"
                }
              }}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}