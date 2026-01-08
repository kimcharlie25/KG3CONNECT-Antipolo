import React from 'react';

import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { siteSettings, loading } = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 bg-kg3-orange shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={onMenuClick}
            className="flex items-center space-x-2 text-white hover:text-gray-100 transition-colors duration-200"
          >
            {loading ? (
              <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse" />
            ) : (
              <img
                src={siteSettings?.site_logo || "/logo.jpg"}
                alt={siteSettings?.site_name || "KG3CONNECT"}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50"
                onError={(e) => {
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
            )}
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              {loading ? (
                <div className="w-24 h-6 bg-white/20 rounded animate-pulse" />
              ) : (
                "KG3CONNECT-Antipolo"
              )}
            </h1>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;