import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthUser, LoginCredentials, RegisterData } from '@/types/auth';
import { supabase } from '../../server/config/supabase';
import { User } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      console.log('[Auth] Checking session...');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('[Auth] Session:', session);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('[Auth] Error checking session:', error);
      } finally {
        setIsLoading(false);
        console.log('[Auth] isLoading set to false (checkSession finally)');
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] Auth state change:', event, session);
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    console.log('[Auth] Loading user profile for:', userId);
    let timeoutId = setTimeout(() => {
      console.warn('[Auth] WARNING: Profile fetch taking longer than 5 seconds!');
    }, 5000);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      console.log('[Auth] Profile fetch result:', { data, error });
      clearTimeout(timeoutId);
      if (error) {
        console.error('[Auth] Error object:', error);
        if (error.code === 'PGRST116') {
          console.log('[Auth] No user profile found, auto-creating...');
          // Fetch user info from Supabase auth
          const { data: { user: authUserInfo } } = await supabase.auth.getUser();
          if (authUserInfo) {
            // Auto-create profile row
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: authUserInfo.id,
                username: authUserInfo.email.split('@')[0],
                email: authUserInfo.email,
                first_name: '',
                last_name: '',
                avatar_url: null,
                bio: '',
                date_of_birth: null,
                location: null,
                website: null,
                preferences: {
                  theme: 'system',
                  notifications: true,
                  privacy: 'private',
                  language: 'en'
                },
                stats: {
                  total_entries: 0,
                  streak_days: 0,
                  longest_streak: 0,
                  average_mood: 0,
                  favorite_tags: []
                },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            if (!insertError) {
              console.log('[Auth] Auto-created user profile, reloading...');
              // Try loading again
              return await loadUserProfile(authUserInfo.id);
            } else {
              console.error('[Auth] Error auto-creating user profile:', insertError);
              setIsLoading(false);
              return;
            }
          }
        } else {
          console.error('[Auth] Error loading user profile (not PGRST116):', error);
          setIsLoading(false);
          return;
        }
      }

      if (data) {
        // Transform database format to app format
        const authUser: AuthUser = {
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          avatar: data.avatar_url || '',
          bio: data.bio || '',
          dateOfBirth: data.date_of_birth || '',
          location: data.location || '',
          website: data.website || '',
          preferences: data.preferences || {
            theme: 'system',
            notifications: true,
            privacy: 'private',
            language: 'en'
          },
          stats: data.stats || {
            totalEntries: 0,
            streakDays: 0,
            longestStreak: 0,
            averageMood: 0,
            favoriteTags: []
          },
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };

        setUser(authUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        console.log('[Auth] User profile loaded, isLoading set to false');
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('[Auth] Caught exception loading user profile:', error);
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', data.username)
        .single();

      if (existingUser) {
        throw new Error('Username already taken');
      }

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            username: data.username,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            avatar_url: null,
            bio: 'Welcome to my thought nest! 🌱',
            date_of_birth: null,
            location: null,
            website: null,
            preferences: {
              theme: 'system',
              notifications: true,
              privacy: 'private',
              language: 'en'
            },
            stats: {
              total_entries: 0,
              streak_days: 0,
              longest_streak: 0,
              average_mood: 0,
              favorite_tags: []
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          throw new Error(profileError.message);
        }

        await loadUserProfile(authData.user.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = async (updatedUser: AuthUser) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          username: updatedUser.username,
          email: updatedUser.email,
          first_name: updatedUser.firstName,
          last_name: updatedUser.lastName,
          avatar_url: updatedUser.avatar || null,
          bio: updatedUser.bio || null,
          date_of_birth: updatedUser.dateOfBirth || null,
          location: updatedUser.location || null,
          website: updatedUser.website || null,
          preferences: updatedUser.preferences,
          stats: updatedUser.stats,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedUser.id);

      if (error) {
        throw new Error(error.message);
      }

      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update profile');
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 