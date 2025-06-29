export interface UserProfile {
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

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  privacy: 'public' | 'private' | 'friends';
  language: string;
  autoSave: boolean;
  exportFormat: 'json' | 'pdf' | 'txt';
} 