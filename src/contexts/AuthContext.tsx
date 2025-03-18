import React, { createContext, useContext } from 'react';

// Simple user profile type
interface UserProfile {
  id: string;
  name: string;
}

// Simple context type with only the required functions
type AuthContextType = {
  user: null;
  userProfile: null;
  loading: boolean;
  signUp: () => Promise<void>;
  signIn: () => Promise<void>;
  signInWithGoogleAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: () => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: false,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogleAuth: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

// Simple provider that doesn't do any actual authentication
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // All functions are no-ops
  const mockFunctions = {
    signUp: async () => {},
    signIn: async () => {},
    signInWithGoogleAuth: async () => {},
    signOut: async () => {},
    updateProfile: async () => {},
  };

  return (
    <AuthContext.Provider
      value={{
        user: null,
        userProfile: null,
        loading: false,
        ...mockFunctions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Helper hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 