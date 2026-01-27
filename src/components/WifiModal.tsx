import React, { useState } from 'react';
import { X, Wifi, ChevronDown } from 'lucide-react';
import { Router } from '../types';

interface WifiModalProps {
    isOpen: boolean;
    onClose: () => void;
    routers?: Router[];
}

const WifiModal: React.FC<WifiModalProps> = ({ isOpen, onClose, routers = [] }) => {
    const [selectedRouterId, setSelectedRouterId] = useState<string | null>(
        routers.length > 0 ? routers[0].id : null
    );

    // Update selection if routers change but no selection made
    React.useEffect(() => {
        if (!selectedRouterId && routers.length > 0) {
            setSelectedRouterId(routers[0].id);
        }
    }, [routers, selectedRouterId]);

    if (!isOpen) return null;

    const activeRouter = routers.find(r => r.id === selectedRouterId) || routers[0];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b shrink-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-kg3-orange/10 rounded-lg">
                            <Wifi className="h-6 w-6 text-kg3-orange" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-sans">Wi-Fi Help</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6 space-y-8">
                    {routers.length > 1 && (
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-kg3-orange"></div>
                                Select Your Router Model
                            </label>
                            <div className="relative group">
                                <select
                                    value={selectedRouterId || ''}
                                    onChange={(e) => setSelectedRouterId(e.target.value)}
                                    className="w-full appearance-none bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-kg3-orange/20 focus:border-kg3-orange outline-none font-bold text-gray-700 cursor-pointer transition-all hover:bg-white"
                                >
                                    {routers.map(router => (
                                        <option key={router.id} value={router.id}>
                                            {router.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none group-hover:text-kg3-orange transition-colors" />
                            </div>
                        </div>
                    )}

                    {activeRouter ? (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Selected Router Info Card */}
                            <div className="bg-kg3-orange/5 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 border border-kg3-orange/10 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Wifi className="w-24 h-24" />
                                </div>

                                {activeRouter.image ? (
                                    <div className="w-80 h-80 flex-shrink-0 bg-white rounded-2xl p-2 shadow-md border border-gray-100 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                                        <img
                                            src={activeRouter.image}
                                            alt={activeRouter.name}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-80 h-80 flex-shrink-0 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-300">
                                        <Wifi className="w-12 h-12" />
                                    </div>
                                )}

                                <div className="text-center md:text-left z-10">
                                    <h3 className="text-xs font-bold text-kg3-orange uppercase tracking-widest mb-1">Active View</h3>
                                    <p className="text-gray-900 font-extrabold text-2xl md:text-3xl leading-none">{activeRouter.name}</p>
                                    <p className="text-gray-500 text-sm mt-3 font-medium">Follow the visual guide below to update your settings.</p>
                                </div>
                            </div>

                            {/* Steps */}
                            <div className="space-y-8">
                                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-kg3-orange pl-4 uppercase tracking-wider">Instructional Steps</h3>
                                <div className="grid gap-12">
                                    {activeRouter.steps && activeRouter.steps.length > 0 ? (
                                        activeRouter.steps.map((step, index) => (
                                            <div key={step.id} className="relative group">
                                                {index !== activeRouter.steps.length - 1 && (
                                                    <div className="absolute left-6 top-16 bottom-12 w-0.5 bg-gradient-to-b from-kg3-orange/20 to-transparent"></div>
                                                )}

                                                <div className="flex flex-col gap-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex-shrink-0 w-12 h-12 bg-kg3-orange text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-kg3-orange/30 transform group-hover:rotate-12 transition-transform">
                                                            {index + 1}
                                                        </div>
                                                        <p className="text-gray-800 text-xl font-bold leading-tight flex-grow">{step.text}</p>
                                                    </div>

                                                    {step.image && (
                                                        <div className="md:ml-16 rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-gray-200 transform hover:scale-[1.02] transition-transform duration-300 bg-gray-50">
                                                            <img
                                                                src={step.image}
                                                                alt={`Step ${index + 1}`}
                                                                className="w-full h-auto object-cover max-h-[400px]"
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                                                <X className="h-8 w-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No Steps Defined</p>
                                            <p className="text-gray-400 text-xs mt-1">Instructions for this model are pending.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-24">
                            <Wifi className="h-16 w-16 text-gray-200 mx-auto mb-4 animate-pulse" />
                            <p className="text-gray-500 font-medium">No router configurations available.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 text-center shrink-0">
                    <p className="text-sm text-gray-500 font-medium">
                        Having trouble? Feel free to contact our support team for help.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WifiModal;
