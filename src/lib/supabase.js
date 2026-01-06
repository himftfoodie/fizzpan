import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wpndjytkrthchzdrtdjs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbmRqeXRrcnRoY2h6ZHJ0ZGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NjcxODUsImV4cCI6MjA3NDM0MzE4NX0.loMJMhl8bKUf04flpig1HVe0xdG6QBc1HE8VEpnEQi4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email, password, userData) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: userData.username,
        role: 'user',
      }
    }
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return {
    ...user,
    role: profile?.role || 'user',
    username: profile?.username || '',
  };
};