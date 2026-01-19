import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user from session with role from metadata or profile
  const getUserFromSession = async (sessionUser) => {
    // First, try to get role from user_metadata (set during signup or manually)
    if (sessionUser.user_metadata?.role) {
      console.log('Using role from user_metadata:', sessionUser.user_metadata.role);
      return {
        ...sessionUser,
        role: sessionUser.user_metadata.role,
        username: sessionUser.user_metadata.username || sessionUser.email?.split('@')[0] || '',
      };
    }

    // Check localStorage cache for role (to avoid repeated slow queries)
    const cachedRole = localStorage.getItem(`user_role_${sessionUser.id}`);
    const cachedUsername = localStorage.getItem(`user_username_${sessionUser.id}`);
    if (cachedRole) {
      console.log('Using cached role:', cachedRole);
      return {
        ...sessionUser,
        role: cachedRole,
        username: cachedUsername || sessionUser.email?.split('@')[0] || '',
      };
    }

    // If no role in metadata or cache, try to fetch from profiles table with timeout
    try {
      console.log('Fetching profile from database...');

      // Create a timeout promise (5 seconds)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );

      // Create the query promise
      const queryPromise = supabase
        .from('profiles')
        .select('role, username')
        .eq('id', sessionUser.id)
        .single();

      // Race them - whichever finishes first wins
      const { data: profile, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (!error && profile) {
        console.log('Profile fetched successfully:', profile.role);
        // Cache the role in localStorage
        localStorage.setItem(`user_role_${sessionUser.id}`, profile.role || 'user');
        localStorage.setItem(`user_username_${sessionUser.id}`, profile.username || '');
        return {
          ...sessionUser,
          role: profile.role || 'user',
          username: profile.username || sessionUser.email?.split('@')[0] || '',
        };
      }
    } catch (err) {
      console.warn('Profile fetch skipped:', err.message);
    }

    // Default fallback - only use 'user' if we really don't know
    console.log('Using default role: user');
    return {
      ...sessionUser,
      role: 'user',
      username: sessionUser.email?.split('@')[0] || '',
    };
  };

  useEffect(() => {
    let isMounted = true;

    // Initialize auth - getSession reads from localStorage (fast)
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && isMounted) {
          const userData = await getUserFromSession(session.user);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for subsequent auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);

        // Only handle actual state changes, not initial session
        if (event === 'INITIAL_SESSION') {
          return; // Already handled by initAuth
        }

        if (session?.user) {
          const userData = await getUserFromSession(session.user);
          if (isMounted) setUser(userData);
        } else {
          if (isMounted) setUser(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    signUp: async (email, password, userData) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            role: 'user',
          }
        }
      });

      if (error) throw error;

      // Create profile in profiles table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            username: userData.username,
            role: 'user',
          }]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return data;
    },
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};