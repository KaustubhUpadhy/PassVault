import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const AuthCallback: React.FC = () => {
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          // Redirect to home with error
          window.location.href = '/?error=auth_failed';
          return;
        }

        if (data.session) {
          // User is authenticated, redirect to app
          window.location.href = '/';
        } else {
          // No session, redirect to home
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        window.location.href = '/?error=auth_failed';
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing authentication...</p>
        <p className="text-purple-300 text-sm mt-2">Please wait while we sign you in</p>
      </div>
    </div>
  );
};
