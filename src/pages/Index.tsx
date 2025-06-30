import { useState, useEffect } from 'react';
import { DiaryCalendar } from '@/components/DiaryCalendar';
import { EntryModal } from '@/components/EntryModal';
import { NavigationHeader } from '@/components/NavigationHeader';
import { WelcomeSection } from '@/components/WelcomeSection';
import { QuickActions } from '@/components/QuickActions';
import { UserProfileModal } from '@/components/UserProfileModal';
import { useAuth } from '@/contexts/AuthContext';
import { diaryService } from '../../server/services/diaryService';

export interface DiaryEntry {
  id: string;
  userId: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const Index = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, updateUser } = useAuth();

  // Load entries from database
  useEffect(() => {
    const loadEntries = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const userEntries = await diaryService.getEntries(user.id);
          setEntries(userEntries);
        } catch (error) {
          console.error('Error loading entries:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadEntries();
  }, [user]);

  // Calculate stats whenever entries change
  useEffect(() => {
    if (user) {
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

      // Only update if stats have changed
      const statsChanged =
        user.stats.totalEntries !== updatedStats.totalEntries ||
        user.stats.streakDays !== updatedStats.streakDays ||
        user.stats.longestStreak !== updatedStats.longestStreak ||
        user.stats.averageMood !== updatedStats.averageMood ||
        JSON.stringify(user.stats.favoriteTags) !== JSON.stringify(updatedStats.favoriteTags);

      if (statsChanged) {
        updateUser({
          ...user,
          stats: updatedStats,
          updatedAt: new Date().toISOString()
        });
      }
    }
  }, [entries, user, updateUser]);

  const handleCreateEntry = (date: Date) => {
    setSelectedDate(date);
    setEditingEntry(null);
    setIsEntryModalOpen(true);
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setSelectedDate(new Date(entry.date));
    setIsEntryModalOpen(true);
  };

  const handleSaveEntry = async (entryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      if (editingEntry) {
        // Update existing entry
        const updatedEntry = await diaryService.updateEntry(editingEntry.id, {
          ...entryData,
          userId: user.id
        });
        
        if (updatedEntry) {
          setEntries(prev => prev.map(entry => 
            entry.id === editingEntry.id ? updatedEntry : entry
          ));
        }
      } else {
        // Create new entry
        const newEntry = await diaryService.createEntry({
          ...entryData,
          userId: user.id
        });
        
        if (newEntry) {
          setEntries(prev => [...prev, newEntry]);
        }
      }
      
      setIsEntryModalOpen(false);
      setEditingEntry(null);
      setSelectedDate(null);
    } catch (error) {
      console.error('Error saving entry:', error);
      // You might want to show a toast notification here
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const success = await diaryService.deleteEntry(entryId);
      if (success) {
        setEntries(prev => prev.filter(entry => entry.id !== entryId));
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleSaveProfile = (profile: any) => {
    updateUser(profile);
    setIsProfileModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your thoughts...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <NavigationHeader onOpenProfile={() => setIsProfileModalOpen(true)} />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <WelcomeSection />
        
        <QuickActions 
          onCreateEntry={() => handleCreateEntry(new Date())}
          entries={entries}
          onEntrySelect={handleEditEntry}
        />
        
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-xl border border-border p-6 mb-8">
          <DiaryCalendar 
            entries={entries}
            onDateSelect={handleCreateEntry}
            onEntrySelect={handleEditEntry}
          />
        </div>
      </main>

      <EntryModal
        isOpen={isEntryModalOpen}
        onClose={() => {
          setIsEntryModalOpen(false);
          setEditingEntry(null);
          setSelectedDate(null);
        }}
        onSave={handleSaveEntry}
        selectedDate={selectedDate}
        editingEntry={editingEntry}
        onDelete={editingEntry ? () => handleDeleteEntry(editingEntry.id) : undefined}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Index;
