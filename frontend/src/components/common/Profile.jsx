import React, { useState, useRef, useEffect } from 'react';

export default function Profile({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fallback user data for demonstration
  const currentUser = user || {
    name: 'Alex Developer',
    email: 'alex@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Developer&background=6366f1&color=fff',
    role: 'Software Engineer'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 group"
      >
        <div className="relative">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-10 h-10 rounded-full border border-slate-600 group-hover:border-indigo-500 transition-colors object-cover"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
        </div>
        
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{currentUser.name}</p>
          <p className="text-xs text-slate-400">{currentUser.role}</p>
        </div>

        <svg 
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
          {/* Mobile Header (visible only on mobile) */}
          <div className="px-4 py-3 border-b border-slate-700 md:hidden">
            <p className="text-sm font-semibold text-white">{currentUser.name}</p>
            <p className="text-xs text-slate-400 truncate mt-0.5">{currentUser.email}</p>
          </div>
          
          <div className="px-2">
            <a href="#profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Your Profile
            </a>
            <a href="#settings" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Settings
            </a>
          </div>

          <div className="border-t border-slate-700 my-2"></div>
          
          <div className="px-2">
            <button className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-700/50 hover:text-red-300 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
