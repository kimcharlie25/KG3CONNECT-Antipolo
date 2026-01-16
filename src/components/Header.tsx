import React from 'react';
import { MapPin } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  onMenuClick: () => void;
  locationName?: string;
  onChangeLocation?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, locationName, onChangeLocation }) => {
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
                siteSettings?.site_name || "KG3CONNECT-Antipolo"
              )}
            </h1>
          </button>

          {/* Location Badge */}
          {locationName && (
            <button
              onClick={onChangeLocation}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full transition-colors duration-200 text-sm"
            >
              <MapPin className="h-4 w-4" />
              <span className="font-medium">{locationName}</span>
              <span className="text-white/80 text-xs">Change</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;