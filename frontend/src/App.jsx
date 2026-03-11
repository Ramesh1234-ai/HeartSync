import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

// Layout Components
import Sidebar from './components/common/sidebar';
import Nav2 from './components/common/navbar';
import SearchBar from './components/common/SearchBar';
import ProfileMenu from './components/common/Profile';

// Real Pages
import AboutUs from './components/pages/us';
import ChatWindow from './components/pages/ChatWindow';
import ProfilePage from './components/profile/profile';
import ClerkLogin from './components/login/Clerk';

// Main Layout to wrap authenticated/inner app pages
function MainLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-200">
      {/* Sidebar Navigation */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        currentUser="Alex Developer" 
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isCollapsed ? 'ml-0 pl-16' : 'ml-64'}`}>
        
        {/* Top Navbar Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
          <div className="flex-1 max-w-2xl mr-4 flex items-center gap-4">
            <Nav2 />
            <div className="flex-1">
              <SearchBar 
                search={search}
                onSearchChange={setSearch}
                availableTags={['dashboard', 'analytics', 'settings', 'chat', 'profile']}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ProfileMenu />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-auto bg-slate-900 p-6">
          <div className="max-w-7xl mx-auto h-full pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Fallback empty pages for the sidebar links that do not have dedicated components yet
const PlaceholderContent = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[80%] text-center">
    <div className="w-20 h-20 mb-6 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/10">
      <span className="text-4xl text-indigo-400">⚙️</span>
    </div>
    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4">{title}</h1>
    <p className="text-slate-400 max-w-md">This section is currently under construction. Check back later for updates or connect existing components.</p>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen text-slate-200 bg-slate-900">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/about" replace />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<ClerkLogin/>} />
        
        {/* Sidebar Linked Routes */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <PlaceholderContent title="Dashboard" />
            </MainLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <MainLayout>
              <PlaceholderContent title="Analytics" />
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <PlaceholderContent title="Settings Overview" />
            </MainLayout>
          }
        />
        <Route
          path="/uploads"
          element={
            <MainLayout>
              <PlaceholderContent title="Manage Uploads" />
            </MainLayout>
          }
        />
        
        {/* Actual Page Component Routes */}
        <Route
          path="/chat"
          element={
            <MainLayout>
              <ChatWindow />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center p-8 h-screen bg-slate-900">
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-6">404</h1>
              <p className="text-2xl text-slate-300 font-semibold mb-2">Page Not Found</p>
              <p className="text-slate-500 mb-8 max-w-sm text-center">The page you're looking for doesn't exist or has been moved.</p>
              <Link to="/about" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20 font-medium flex items-center gap-2">
                <span>&larr;</span> Return Home
              </Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}
