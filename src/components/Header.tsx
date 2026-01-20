import React, { useState } from 'react';
import { MapPin, Menu as MenuIcon, X, Wifi, ChevronRight } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import WifiModal from './WifiModal';

interface HeaderProps {
  onMenuClick: () => void;
  locationName?: string;
  onChangeLocation?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, locationName, onChangeLocation }) => {
  const { siteSettings, loading } = useSiteSettings();
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-kg3-orange shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo and Name */}
          <div className="flex items-center space-x-4">
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
          </div>

          {/* Right Side Tools */}
          <div className="flex items-center space-x-3 lg:space-x-6">
            {/* Desktop Only: Wifi Help Button */}
            <button
              onClick={() => setIsWifiModalOpen(true)}
              className="hidden md:flex items-center space-x-2 text-white/90 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <Wifi className="h-4 w-4" />
              <span>Change Wi-Fi Password?</span>
            </button>

            {/* Desktop Only: Location Badge */}
            {locationName && (
              <button
                onClick={onChangeLocation}
                className="hidden md:flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all duration-200 text-sm whitespace-nowrap active:scale-95"
              >
                <MapPin className="h-4 w-4" />
                <span className="font-bold">{locationName}</span>
                <span className="text-white/70 bg-white/10 px-2 py-0.5 rounded-md text-[10px] ml-1 uppercase">Switch</span>
              </button>
            )}

            {/* Mobile Only: Hamburger Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200">
          <div
            className="absolute inset-x-0 top-0 bg-white border-b shadow-2xl p-6 space-y-6 animate-in slide-in-from-top duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quick Actions</label>

              <button
                onClick={() => {
                  setIsWifiModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between bg-kg3-orange/5 text-kg3-orange p-4 rounded-2xl border border-kg3-orange/20 font-bold active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-kg3-orange text-white rounded-lg shadow-md shadow-kg3-orange/20">
                    <Wifi className="h-5 w-5" />
                  </div>
                  <span>Change Wi-Fi Password?</span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </button>

              {locationName && (
                <button
                  onClick={() => {
                    onChangeLocation?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between bg-gray-50 text-gray-700 p-4 rounded-2xl border border-gray-200 font-bold active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-200 text-gray-600 rounded-lg">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-gray-400 font-bold -mb-0.5 uppercase tracking-wider">Current Location</span>
                      <span>{locationName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-gray-200 px-2 py-1 rounded text-gray-500 uppercase">Change</span>
                    <ChevronRight className="h-5 w-5 opacity-30" />
                  </div>
                </button>
              )}
            </div>

            <div className="pt-2 border-t text-center">
              <p className="text-xs text-gray-400 font-medium italic">Empowering your fiber connectivity.</p>
            </div>
          </div>
          <div className="h-full" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      <WifiModal
        isOpen={isWifiModalOpen}
        onClose={() => setIsWifiModalOpen(false)}
        routers={siteSettings?.wifi_routers}
      />
    </header>
  );
};

export default Header;
