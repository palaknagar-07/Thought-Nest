export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  location?: string;
  website?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    privacy: 'public' | 'private' | 'friends';
    language: string;
  };
  stats: {
    totalEntries: number;
    streakDays: number;
    longestStreak: number;
    averageMood: number;
    favoriteTags: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
  clearError: () => void;
} 