import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/types/user';

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  updateUser: (profile: UserProfile) => void;
  logout: () => void;
  calculateStats: (entries: any[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Default user profile
const defaultUser: UserProfile = {
  id: '1',
  username: 'diaryuser',
  email: 'user@example.com',
  firstName: 'Diary',
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
    totalEntries: 0,
    streakDays: 0,
    longestStreak: 0,
    averageMood: 0,
    favoriteTags: []
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage or use default
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        setUser(defaultUser);
      }
    } else {
      setUser(defaultUser);
    }
    setIsLoading(false);
  }, []);

  const updateUser = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('user', JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // You can add additional logout logic here (API calls, etc.)
  };

  const calculateStats = (entries: any[]) => {
    if (!user) return;

    const totalEntries = entries.length;
    
    // Calculate streak
    let currentStreak = 0;
    let longestStreak = user.stats.longestStreak;
    const today = new Date();
    const sortedEntries = entries
      .map(entry => new Date(entry.date))
      .sort((a, b) => b.getTime() - a.getTime());

    if (sortedEntries.length > 0) {
      let streak = 0;
      let currentDate = new Date(today);
      currentDate.setHours(0, 0, 0, 0);

      for (let i = 0; i < 365; i++) { // Check last year
        const hasEntry = sortedEntries.some(entryDate => {
          const entryDay = new Date(entryDate);
          entryDay.setHours(0, 0, 0, 0);
          return entryDay.getTime() === currentDate.getTime();
        });

        if (hasEntry) {
          streak++;
          if (streak === 1) currentStreak = streak;
        } else {
          if (streak > longestStreak) {
            longestStreak = streak;
          }
          streak = 0;
        }

        currentDate.setDate(currentDate.getDate() - 1);
      }
    }

    // Calculate average mood
    const moodEntries = entries.filter(entry => entry.mood && !isNaN(parseInt(entry.mood)));
    const averageMood = moodEntries.length > 0 
      ? moodEntries.reduce((sum, entry) => sum + parseInt(entry.mood), 0) / moodEntries.length 
      : 0;

    // Calculate favorite tags
    const tagCounts: { [key: string]: number } = {};
    entries.forEach(entry => {
      entry.tags?.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const favoriteTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);

    const updatedStats = {
      totalEntries,
      streakDays: currentStreak,
      longestStreak,
      averageMood,
      favoriteTags
    };

    updateUser({
      ...user,
      stats: updatedStats,
      updatedAt: new Date().toISOString()
    });
  };

  const value = {
    user,
    isLoading,
    updateUser,
    logout,
    calculateStats
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 