import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthUser, LoginCredentials, RegisterData } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database (in a real app, this would be an API)
const mockUsers: AuthUser[] = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    avatar: '',
    bio: 'Welcome to my thought nest! 🌱',
    dateOfBirth: '',
    location: '',
    website: '',
    preferences: {
      theme: 'system',
      notifications: true,
      privacy: 'private',
      language: 'en'
    },
    stats: {
      totalEntries: 5,
      streakDays: 3,
      longestStreak: 7,
      averageMood: 4.2,
      favoriteTags: ['gratitude', 'reflection', 'goals']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Simple password hash simulation (in real app, use proper hashing)
const hashPassword = (password: string): string => {
  return btoa(password); // Base64 encoding (NOT secure, just for demo)
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

// Mock password database
const mockPasswords: { [key: string]: string } = {
  'demo@example.com': hashPassword('demo123')
};

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
    const savedUser = localStorage.getItem('authUser');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists
      const user = mockUsers.find(u => u.email === credentials.email);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify password
      const hashedPassword = mockPasswords[credentials.email];
      if (!hashedPassword || !verifyPassword(credentials.password, hashedPassword)) {
        throw new Error('Invalid password');
      }

      // Create session
      const token = `token_${user.id}_${Date.now()}`;
      localStorage.setItem('authUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);

      setUser(user);
      setIsAuthenticated(true);
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if email already exists
      if (mockUsers.find(u => u.email === data.email)) {
        throw new Error('Email already registered');
      }

      // Check if username already exists
      if (mockUsers.find(u => u.username === data.username)) {
        throw new Error('Username already taken');
      }

      // Check password confirmation
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Create new user
      const newUser: AuthUser = {
        id: (mockUsers.length + 1).toString(),
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: '',
        bio: 'Welcome to my thought nest! 🌱',
        dateOfBirth: '',
        location: '',
        website: '',
        preferences: {
          theme: 'system',
          notifications: true,
          privacy: 'private',
          language: 'en'
        },
        stats: {
          totalEntries: 0,
          streakDays: 0,
          longestStreak: 0,
          averageMood: 0,
          favoriteTags: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to mock database
      mockUsers.push(newUser);
      mockPasswords[data.email] = hashPassword(data.password);

      // Create session
      const token = `token_${newUser.id}_${Date.now()}`;
      localStorage.setItem('authUser', JSON.stringify(newUser));
      localStorage.setItem('authToken', token);

      setUser(newUser);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const updateUser = (updatedUser: AuthUser) => {
    setUser(updatedUser);
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
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