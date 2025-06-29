import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AuthUser } from '@/types/auth';
import { User, Settings, LogOut, Bell, Shield, Download, HelpCircle } from 'lucide-react';

interface UserProfileDropdownProps {
  profile: AuthUser;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const UserProfileDropdown = ({ profile, onOpenProfile, onLogout }: UserProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return <Shield className="w-3 h-3" />;
      case 'friends':
        return <User className="w-3 h-3" />;
      case 'private':
        return <Shield className="w-3 h-3" />;
      default:
        return <Shield className="w-3 h-3" />;
    }
  };

  const getPrivacyLabel = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return 'Public';
      case 'friends':
        return 'Friends';
      case 'private':
        return 'Private';
      default:
        return 'Private';
    }
  };

  const getPrivacyColor = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700';
      case 'friends':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700';
      case 'private':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-orange-50 dark:hover:bg-orange-950/50 transition-colors">
          <Avatar className="h-10 w-10 ring-2 ring-orange-100 dark:ring-orange-900/30 hover:ring-orange-200 dark:hover:ring-orange-800/50 transition-all">
            <AvatarImage src={profile.avatar} alt={profile.firstName} />
            <AvatarFallback className="bg-gradient-to-br from-orange-200 to-pink-200 text-orange-700 dark:from-orange-600 dark:to-pink-600 dark:text-orange-200 font-semibold">
              {getInitials(profile.firstName, profile.lastName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-background/95 backdrop-blur-md border-border/50 shadow-xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-orange-100 dark:ring-orange-900/30">
                <AvatarImage src={profile.avatar} alt={profile.firstName} />
                <AvatarFallback className="bg-gradient-to-br from-orange-200 to-pink-200 text-orange-700 dark:from-orange-600 dark:to-pink-600 dark:text-orange-200 font-semibold">
                  {getInitials(profile.firstName, profile.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-none text-foreground truncate">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate mt-1">
                  @{profile.username}
                </p>
                {profile.bio && (
                  <p className="text-xs text-muted-foreground/80 truncate mt-1">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`text-xs ${getPrivacyColor(profile.preferences.privacy)}`}>
                {getPrivacyIcon(profile.preferences.privacy)}
                <span className="ml-1">{getPrivacyLabel(profile.preferences.privacy)}</span>
              </Badge>
              {profile.preferences.notifications && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                  <Bell className="w-3 h-3 mr-1" />
                  Notifications
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem 
          onClick={onOpenProfile}
          className="flex items-center py-3 px-4 hover:bg-orange-50 dark:hover:bg-orange-950/50 cursor-pointer transition-colors"
        >
          <User className="mr-3 h-4 w-4 text-orange-600 dark:text-orange-400" />
          <span className="text-foreground">View Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center py-3 px-4 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer transition-colors">
          <Settings className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-foreground">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center py-3 px-4 hover:bg-green-50 dark:hover:bg-green-950/50 cursor-pointer transition-colors">
          <Download className="mr-3 h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-foreground">Export Data</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem className="flex items-center py-3 px-4 hover:bg-purple-50 dark:hover:bg-purple-950/50 cursor-pointer transition-colors">
          <HelpCircle className="mr-3 h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-foreground">Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem 
          onClick={onLogout} 
          className="flex items-center py-3 px-4 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer transition-colors text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 