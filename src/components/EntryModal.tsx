import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { DiaryEntry } from '@/pages/Index';
import { MoodSelector } from '@/components/MoodSelector';
import { X, Save, Trash2, Tag } from 'lucide-react';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: () => void;
  selectedDate: Date | null;
  editingEntry?: DiaryEntry | null;
}

export const EntryModal = ({ isOpen, onClose, onSave, onDelete, selectedDate, editingEntry }: EntryModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('happy');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (editingEntry) {
      setTitle(editingEntry.title);
      setContent(editingEntry.content);
      setMood(editingEntry.mood);
      setTags(editingEntry.tags);
    } else {
      setTitle('');
      setContent('');
      setMood('happy');
      setTags([]);
    }
    setNewTag('');
  }, [editingEntry, isOpen]);

  const handleSave = () => {
    if (!selectedDate || !title.trim() || !content.trim()) return;

    onSave({
      date: selectedDate.toISOString(),
      title: title.trim(),
      content: content.trim(),
      mood,
      tags
    });

    // Reset form
    setTitle('');
    setContent('');
    setMood('happy');
    setTags([]);
    setNewTag('');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card to-muted/20 border-2 border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-foreground flex items-center justify-between">
            {editingEntry ? 'Edit Entry' : 'New Diary Entry'}
            {selectedDate && (
              <span className="text-lg font-normal text-muted-foreground">
                {format(selectedDate, 'MMM d, yyyy')}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Title Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Entry Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind today?"
              className="bg-background/80 border-border focus:border-ring rounded-xl"
            />
          </div>

          {/* Mood Selector */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              How are you feeling?
            </label>
            <MoodSelector selectedMood={mood} onMoodSelect={setMood} />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Your thoughts...
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Dear diary, today I..."
              className="min-h-[200px] bg-background/80 border-border focus:border-ring rounded-xl resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-accent text-accent-foreground hover:bg-accent/80 cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a tag..."
                className="bg-background/80 border-border focus:border-ring rounded-xl flex-1"
              />
              <Button 
                onClick={handleAddTag}
                variant="outline"
                size="sm"
                className="border-border text-foreground hover:bg-accent"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-border">
            <div>
              {onDelete && (
                <Button
                  onClick={() => {
                    onDelete();
                    onClose();
                  }}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!title.trim() || !content.trim()}
                className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
