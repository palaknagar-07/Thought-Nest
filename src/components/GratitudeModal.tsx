import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GratitudeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GratitudeModal = ({ isOpen, onClose }: GratitudeModalProps) => {
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(['']);
  const { toast } = useToast();

  const addGratitudeItem = () => {
    setGratitudeItems([...gratitudeItems, '']);
  };

  const removeGratitudeItem = (index: number) => {
    setGratitudeItems(gratitudeItems.filter((_, i) => i !== index));
  };

  const updateGratitudeItem = (index: number, value: string) => {
    const updated = [...gratitudeItems];
    updated[index] = value;
    setGratitudeItems(updated);
  };

  const handleSave = () => {
    const validItems = gratitudeItems.filter(item => item.trim() !== '');
    if (validItems.length === 0) {
      toast({
        title: "Add some gratitude items",
        description: "Please add at least one thing you're grateful for.",
      });
      return;
    }

    // Here you would typically save to your backend/storage
    console.log('Saving gratitude items:', validItems);
    
    toast({
      title: "Gratitude saved! ✨",
      description: `Saved ${validItems.length} gratitude ${validItems.length === 1 ? 'item' : 'items'}.`,
    });
    
    setGratitudeItems(['']);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Heart className="w-5 h-5" />
            Gratitude Log
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            What are you grateful for today? 🌟
          </p>
          
          <div className="space-y-3">
            {gratitudeItems.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  placeholder={`Gratitude #${index + 1}...`}
                  value={item}
                  onChange={(e) => updateGratitudeItem(index, e.target.value)}
                  className="flex-1 min-h-[60px] resize-none"
                />
                {gratitudeItems.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGratitudeItem(index)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={addGratitudeItem}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another
          </Button>
          
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Save Gratitude
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
