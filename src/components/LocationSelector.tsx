import React from 'react';
import { MapPin } from 'lucide-react';
import { useLocations } from '../hooks/useLocations';
import { Location } from '../types';

interface LocationSelectorProps {
    onSelectLocation: (location: Location) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onSelectLocation }) => {
    const { locations, loading, error } = useLocations();

    // Filter only active locations
    const activeLocations = locations.filter(loc => loc.active);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading locations...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>Error loading locations: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="mx-auto w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <MapPin className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Select Your Location
                    </h1>
                    <p className="text-gray-600">
                        Choose a branch to view available services and plans
                    </p>
                </div>

                {/* Location Cards */}
                <div className="space-y-4">
                    {activeLocations.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No locations available at the moment.</p>
                        </div>
                    ) : (
                        activeLocations.map((location) => (
                            <button
                                key={location.id}
                                onClick={() => onSelectLocation(location)}
                                className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-left border border-gray-100 hover:border-green-500 group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300">
                                        <MapPin className="h-6 w-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                                            {location.name}
                                        </h3>
                                        {location.address && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {location.address}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-6 w-6 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationSelector;
