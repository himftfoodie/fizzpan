import { supabase } from '../lib/supabase';

export const getProfiles = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getProfileById = async (id) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
};

export const createProfile = async (profileData) => {
    const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const updateProfile = async (id, updates) => {
    const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const deleteProfile = async (id) => {
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
    if (error) throw error;
};
