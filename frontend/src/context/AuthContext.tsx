import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, AuthState, SignUpData, SignInData } from '../types/auth';

interface AuthContextType extends AuthState {
  signUp: (data: SignUpData) => Promise<{ error: any }>;
  signIn: (data: SignInData) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithGitHub: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
  onToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, onToast }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.full_name || session.user.user_metadata.name || 'User',
          avatar_url: session.user.user_metadata.avatar_url,
          created_at: session.user.created_at,
        });
      }
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.full_name || session.user.user_metadata.name || 'User',
            avatar_url: session.user.user_metadata.avatar_url,
            created_at: session.user.created_at,
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (data: SignUpData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
          },
        },
      });

      if (error) {
        onToast(error.message, 'error');
        return { error };
      }

      onToast('Check your email for verification link!', 'success');
      return { error: null };
    } catch (error: any) {
      onToast('Sign up failed', 'error');
      return { error };
    }
  };

  const signIn = async (data: SignInData) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        onToast(error.message, 'error');
        return { error };
      }

      onToast('Signed in successfully!', 'success');
      return { error: null };
    } catch (error: any) {
      onToast('Sign in failed', 'error');
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        onToast(error.message, 'error');
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      onToast('Google sign in failed', 'error');
      return { error };
    }
  };

  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        onToast(error.message, 'error');
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      onToast('GitHub sign in failed', 'error');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        onToast(error.message, 'error');
      } else {
        onToast('Signed out successfully!', 'success');
      }
    } catch (error: any) {
      onToast('Sign out failed', 'error');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        onToast(error.message, 'error');
        return { error };
      }

      onToast('Check your email for password reset instructions!', 'success');
      return { error: null };
    } catch (error: any) {
      onToast('Password reset failed', 'error');
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        onToast(error.message, 'error');
        return { error };
      }

      onToast('Password updated successfully!', 'success');
      return { error: null };
    } catch (error: any) {
      onToast('Password update failed', 'error');
      return { error };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    resetPassword,
    updatePassword,
    showToast: onToast,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};