import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, MapPin } from 'lucide-react';
import { useLocations } from '../hooks/useLocations';
import { Location } from '../types';

const LocationManager: React.FC = () => {
    const { locations, loading, addLocation, updateLocation, deleteLocation } = useLocations();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Location>>({
        name: '',
        address: '',
        messengerUrl: '',
        active: true,
        sortOrder: 0
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const resetForm = () => {
        setFormData({ name: '', address: '', messengerUrl: '', active: true, sortOrder: 0 });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleAdd = () => {
        setIsAdding(true);
        setEditingId(null);
        setFormData({ name: '', address: '', messengerUrl: '', active: true, sortOrder: locations.length });
    };

    const handleEdit = (location: Location) => {
        setEditingId(location.id);
        setIsAdding(false);
        setFormData({
            name: location.name,
            address: location.address || '',
            messengerUrl: location.messengerUrl || '',
            active: location.active,
            sortOrder: location.sortOrder
        });
    };

    const handleSave = async () => {
        if (!formData.name?.trim()) {
            alert('Location name is required');
            return;
        }

        try {
            setIsProcessing(true);
            if (editingId) {
                await updateLocation(editingId, formData as Location);
            } else {
                await addLocation(formData as Omit<Location, 'id'>);
            }
            resetForm();
        } catch (error) {
            alert('Failed to save location');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this location? Menu items assigned to this location will be unlinked.')) {
            try {
                setIsProcessing(true);
                await deleteLocation(id);
            } catch (error) {
                alert('Failed to delete location');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleToggleActive = async (location: Location) => {
        try {
            await updateLocation(location.id, { ...location, active: !location.active });
        } catch (error) {
            alert('Failed to update location status');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Manage Locations</h2>
                <button
                    onClick={handleAdd}
                    disabled={isAdding}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Location</span>
                </button>
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {isAdding ? 'Add New Location' : 'Edit Location'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="e.g., Antipolo"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                value={formData.address || ''}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="e.g., 123 Main St, Antipolo City"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sort Order
                            </label>
                            <input
                                type="number"
                                value={formData.sortOrder || 0}
                                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                min="0"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Facebook Messenger Page URL
                            </label>
                            <input
                                type="text"
                                value={formData.messengerUrl || ''}
                                onChange={(e) => setFormData({ ...formData, messengerUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="e.g., https://m.me/yourpageid"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Customers will be redirected to this Messenger URL when ordering from this location.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.active ?? true}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={resetForm}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                        >
                            <X className="h-4 w-4" />
                            <span>Cancel</span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            <span>{isProcessing ? 'Saving...' : 'Save'}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Locations List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {locations.length === 0 ? (
                    <div className="text-center py-12">
                        <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No locations yet. Add your first location to get started.</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Address</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Messenger URL</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Order</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {locations.map((location) => (
                                <tr key={location.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <MapPin className="h-4 w-4 text-green-600" />
                                            </div>
                                            <span className="font-medium text-gray-900">{location.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {location.address || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {location.messengerUrl ? (
                                            <a
                                                href={location.messengerUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[200px] block"
                                                title={location.messengerUrl}
                                            >
                                                {location.messengerUrl.replace('https://m.me/', 'm.me/')}
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {location.sortOrder}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleActive(location)}
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${location.active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {location.active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(location)}
                                                disabled={isProcessing}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(location.id)}
                                                disabled={isProcessing}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default LocationManager;
