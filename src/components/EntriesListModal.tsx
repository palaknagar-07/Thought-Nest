import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Tag, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { DiaryEntry } from '@/pages/Index';

interface EntriesListModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: DiaryEntry[];
  onEntrySelect: (entry: DiaryEntry) => void;
}

export const EntriesListModal = ({ isOpen, onClose, entries, onEntrySelect }: EntriesListModalProps) => {
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleEntryClick = (entry: DiaryEntry) => {
    onEntrySelect(entry);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Calendar className="w-5 h-5" />
            All Entries ({entries.length})
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {sortedEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No entries yet. Start writing your first entry!</p>
            </div>
          ) : (
            sortedEntries.map((entry) => (
              <div
                key={entry.id}
                className="border border-border rounded-lg p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => handleEntryClick(entry)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {entry.title || 'Untitled Entry'}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {(() => {
                      const date = entry.date ? new Date(entry.date) : null;
                      return date && !isNaN(date.getTime())
                        ? format(date, 'MMM dd, yyyy')
                        : 'Invalid date';
                    })()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {(() => {
                      const createdAt = entry.createdAt ? new Date(entry.createdAt) : null;
                      return createdAt && !isNaN(createdAt.getTime())
                        ? format(createdAt, 'HH:mm')
                        : 'Invalid time';
                    })()}
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {entry.content || 'No content'}
                </p>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {entry.mood && (
                    <Badge variant="secondary" className="text-xs">
                      {entry.mood}
                    </Badge>
                  )}
                  {entry.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="border-t border-border pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
