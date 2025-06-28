import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Heart, Calendar } from 'lucide-react';
import { GratitudeModal } from './GratitudeModal';
import { EntriesListModal } from './EntriesListModal';
import { DiaryEntry } from '@/pages/Index';

interface QuickActionsProps {
  onCreateEntry: () => void;
  entries: DiaryEntry[];
  onEntrySelect: (entry: DiaryEntry) => void;
}

export const QuickActions = ({ onCreateEntry, entries, onEntrySelect }: QuickActionsProps) => {
  const [isGratitudeModalOpen, setIsGratitudeModalOpen] = useState(false);
  const [isEntriesModalOpen, setIsEntriesModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <Button 
          onClick={onCreateEntry}
          className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white shadow-lg transform hover:scale-105 transition-all duration-200 px-6 py-3 rounded-full"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Write New Entry
        </Button>
        
        <Button 
          onClick={() => setIsGratitudeModalOpen(true)}
          variant="outline" 
          className="border-border text-foreground hover:bg-accent shadow-sm rounded-full px-6 py-3"
        >
          <Heart className="w-4 h-4 mr-2" />
          Gratitude Log
        </Button>
        
        <Button 
          onClick={() => setIsEntriesModalOpen(true)}
          variant="outline"
          className="border-border text-foreground hover:bg-accent shadow-sm rounded-full px-6 py-3"
        >
          <Calendar className="w-4 h-4 mr-2" />
          View All Entries
        </Button>
      </div>

      <GratitudeModal
        isOpen={isGratitudeModalOpen}
        onClose={() => setIsGratitudeModalOpen(false)}
      />

      <EntriesListModal
        isOpen={isEntriesModalOpen}
        onClose={() => setIsEntriesModalOpen(false)}
        entries={entries}
        onEntrySelect={onEntrySelect}
      />
    </>
  );
};
