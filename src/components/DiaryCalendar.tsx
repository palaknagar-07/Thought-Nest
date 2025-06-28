import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useState } from 'react';
import { DiaryEntry } from '@/pages/Index';
import { Badge } from '@/components/ui/badge';

interface DiaryCalendarProps {
  entries: DiaryEntry[];
  onDateSelect: (date: Date) => void;
  onEntrySelect: (entry: DiaryEntry) => void;
}

export const DiaryCalendar = ({ entries, onDateSelect, onEntrySelect }: DiaryCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect(date);
    }
  };

  const getEntriesForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries.filter(entry => entry.date === dateStr);
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      happy: '😊',
      excited: '🤩',
      grateful: '🙏',
      loved: '🥰',
      calm: '😌',
      neutral: '😐',
      tired: '😴',
      anxious: '😰',
      sad: '😢',
      angry: '😠'
    };
    return moodEmojis[mood] || '😐';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2 font-serif">Your Journal Calendar</h3>
        <p className="text-muted-foreground">Click on any date to create a new entry or view existing ones</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-2xl border-2 border-border shadow-inner bg-gradient-to-br from-card to-muted/20"
            modifiers={{
              hasEntry: (date) => getEntriesForDate(date).length > 0
            }}
            modifiersStyles={{
              hasEntry: {
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                fontWeight: 'bold',
                borderRadius: '50%'
              }
            }}
          />
        </div>
        
        {selectedDate && (
          <div className="lg:w-80 bg-gradient-to-br from-muted/20 to-accent/20 rounded-2xl p-4 border border-border">
            <h4 className="text-lg font-semibold text-foreground mb-3 font-serif">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h4>
            
            {getEntriesForDate(selectedDate).length === 0 ? (
              <p className="text-muted-foreground italic text-center py-8">
                No entries for this day yet.
                <br />
                <span className="text-sm">Click to create your first entry!</span>
              </p>
            ) : (
              <div className="space-y-3">
                {getEntriesForDate(selectedDate).map(entry => (
                  <div
                    key={entry.id}
                    onClick={() => onEntrySelect(entry)}
                    className="bg-card/80 rounded-xl p-3 cursor-pointer hover:bg-card transition-all duration-200 shadow-sm hover:shadow-md border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-foreground truncate">{entry.title}</h5>
                      <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {entry.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{entry.tags.slice(0, 2).join(', ')}</span>
                      <span>{format(new Date(entry.updatedAt), 'MMM d')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
