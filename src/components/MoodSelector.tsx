import { Button } from '@/components/ui/button';

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: string) => void;
}

const moods = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'excited', emoji: '🤩', label: 'Excited' },
  { id: 'grateful', emoji: '🙏', label: 'Grateful' },
  { id: 'loved', emoji: '🥰', label: 'Loved' },
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'tired', emoji: '😴', label: 'Tired' },
  { id: 'anxious', emoji: '😰', label: 'Anxious' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'angry', emoji: '😠', label: 'Angry' }
];

export const MoodSelector = ({ selectedMood, onMoodSelect }: MoodSelectorProps) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {moods.map(mood => (
        <Button
          key={mood.id}
          onClick={() => onMoodSelect(mood.id)}
          variant={selectedMood === mood.id ? "default" : "outline"}
          className={`flex flex-col items-center p-3 h-auto aspect-square rounded-xl transition-all duration-200 ${
            selectedMood === mood.id 
              ? 'bg-gradient-to-br from-orange-400 to-pink-400 text-white border-transparent shadow-lg scale-105' 
              : 'bg-card/80 border-border hover:bg-accent hover:border-accent-foreground hover:scale-105'
          }`}
        >
          <span className="text-2xl mb-1">{mood.emoji}</span>
          <span className="text-xs font-medium">{mood.label}</span>
        </Button>
      ))}
    </div>
  );
};
