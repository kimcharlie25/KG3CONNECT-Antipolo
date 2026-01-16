import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Location } from '../types';

export const useLocations = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLocations = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('locations')
                .select('*')
                .order('sort_order', { ascending: true });

            if (fetchError) throw fetchError;

            const formattedLocations: Location[] = data?.map(loc => ({
                id: loc.id,
                name: loc.name,
                address: loc.address || undefined,
                active: loc.active,
                sortOrder: loc.sort_order
            })) || [];

            setLocations(formattedLocations);
            setError(null);
        } catch (err) {
            console.error('Error fetching locations:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch locations');
        } finally {
            setLoading(false);
        }
    }, []);

    const addLocation = async (location: Omit<Location, 'id'>) => {
        try {
            const { data, error: insertError } = await supabase
                .from('locations')
                .insert({
                    name: location.name,
                    address: location.address || null,
                    active: location.active ?? true,
                    sort_order: location.sortOrder ?? 0
                })
                .select()
                .single();

            if (insertError) throw insertError;

            await fetchLocations();
            return data;
        } catch (err) {
            console.error('Error adding location:', err);
            throw err;
        }
    };

    const updateLocation = async (id: string, updates: Partial<Location>) => {
        try {
            const { error: updateError } = await supabase
                .from('locations')
                .update({
                    name: updates.name,
                    address: updates.address || null,
                    active: updates.active,
                    sort_order: updates.sortOrder
                })
                .eq('id', id);

            if (updateError) throw updateError;

            await fetchLocations();
        } catch (err) {
            console.error('Error updating location:', err);
            throw err;
        }
    };

    const deleteLocation = async (id: string) => {
        try {
            const { error: deleteError } = await supabase
                .from('locations')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            await fetchLocations();
        } catch (err) {
            console.error('Error deleting location:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    return {
        locations,
        loading,
        error,
        addLocation,
        updateLocation,
        deleteLocation,
        refetch: fetchLocations
    };
};
