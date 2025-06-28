import { useState } from 'react';
import { DiaryCalendar } from '@/components/DiaryCalendar';
import { EntryModal } from '@/components/EntryModal';
import { NavigationHeader } from '@/components/NavigationHeader';
import { WelcomeSection } from '@/components/WelcomeSection';
import { QuickActions } from '@/components/QuickActions';

export interface DiaryEntry {
  id: string;
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

  const handleSaveEntry = (entryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    if (editingEntry) {
      setEntries(prev => prev.map(entry => 
        entry.id === editingEntry.id 
          ? { ...entryData, id: editingEntry.id, createdAt: editingEntry.createdAt, updatedAt: now }
          : entry
      ));
    } else {
      const newEntry: DiaryEntry = {
        ...entryData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now
      };
      setEntries(prev => [...prev, newEntry]);
    }
    
    setIsEntryModalOpen(false);
    setEditingEntry(null);
    setSelectedDate(null);
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <NavigationHeader />
      
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
    </div>
  );
};

export default Index;
