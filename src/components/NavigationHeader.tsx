import { Button } from '@/components/ui/button';
import { Moon, Sun, Settings, Search, Book } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { UserProfileDropdown } from './UserProfileDropdown';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationHeaderProps {
  onOpenProfile: () => void;
}

export const NavigationHeader = ({ onOpenProfile }: NavigationHeaderProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    // You can add additional logout logic here
  };

  return (
    <header className="bg-background/90 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-pink-200 dark:from-orange-600 dark:to-pink-600 rounded-full flex items-center justify-center">
            <Book className="w-5 h-5 text-orange-700 dark:text-orange-200" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground font-serif">My Diary</h1>
            <p className="text-sm text-muted-foreground">Your safe space for thoughts and memories</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Search className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <UserProfileDropdown 
            profile={user}
            onOpenProfile={onOpenProfile}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};
