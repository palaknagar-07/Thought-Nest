import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AuthUser } from '@/types/auth';
import { Calendar, MapPin, Globe, Edit, Save, X, Camera, TrendingUp, Target, Heart, Hash } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AuthUser;
  onSave: (profile: AuthUser) => void;
}

export const UserProfileModal = ({ isOpen, onClose, profile, onSave }: UserProfileModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<AuthUser>(profile);
  const [settings, setSettings] = useState({
    theme: profile.preferences.theme,
    notifications: profile.preferences.notifications,
    privacy: profile.preferences.privacy,
    language: profile.preferences.language,
    autoSave: true,
    exportFormat: 'json' as 'json' | 'pdf' | 'txt'
  });

  const handleSave = () => {
    const updatedProfile = {
      ...editedProfile,
      preferences: {
        theme: settings.theme,
        notifications: settings.notifications,
        privacy: settings.privacy,
        language: settings.language
      },
      updatedAt: new Date().toISOString()
    };
    onSave(updatedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setSettings({
      theme: profile.preferences.theme,
      notifications: profile.preferences.notifications,
      privacy: profile.preferences.privacy,
      language: profile.preferences.language,
      autoSave: true,
      exportFormat: 'json'
    });
    setIsEditing(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-md border-border/50">
        <DialogHeader className="border-b border-border/50 pb-4">
          <DialogTitle className="flex items-center justify-between text-foreground">
            <span className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              User Profile
            </span>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950/50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancel}
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-950/50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 border border-border/50">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Statistics
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <div className="flex items-start space-x-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24 ring-4 ring-orange-100 dark:ring-orange-900/30 shadow-lg">
                    <AvatarImage src={editedProfile.avatar} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-orange-200 to-pink-200 text-orange-700 dark:from-orange-600 dark:to-pink-600 dark:text-orange-200">
                      {getInitials(editedProfile.firstName, editedProfile.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg text-foreground">
                    {isEditing ? (
                      <Input
                        value={editedProfile.username}
                        onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                        className="text-center border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                      />
                    ) : (
                      <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                        @{editedProfile.username}
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">First Name</Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.firstName}
                        onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                        className="border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">{editedProfile.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground">Last Name</Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.lastName}
                        onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
                        className="border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">{editedProfile.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">Email</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      className="border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">{editedProfile.email}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedProfile.bio || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md min-h-[60px] flex items-center">
                      {editedProfile.bio || 'No bio yet'}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-400" />
                      Date of Birth
                    </Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editedProfile.dateOfBirth || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, dateOfBirth: e.target.value })}
                        className="border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                        {editedProfile.dateOfBirth ? new Date(editedProfile.dateOfBirth).toLocaleDateString() : 'Not set'}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-400" />
                      Location
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.location || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                        placeholder="City, Country"
                        className="border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">{editedProfile.location || 'Not set'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-400" />
                    Website
                  </Label>
                  {isEditing ? (
                    <Input
                      type="url"
                      value={editedProfile.website || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, website: e.target.value })}
                      placeholder="https://example.com"
                      className="border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                      {editedProfile.website ? (
                        <a href={editedProfile.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 underline">
                          {editedProfile.website}
                        </a>
                      ) : (
                        'Not set'
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950/30 dark:to-pink-950/30 border-orange-200 dark:border-orange-800 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-orange-700 dark:text-orange-300">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Total Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">{profile.stats.totalEntries}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-blue-700 dark:text-blue-300">
                    <Target className="w-4 h-4 mr-2" />
                    Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{profile.stats.streakDays} days</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-200 dark:border-pink-800 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-pink-700 dark:text-pink-300">
                    <Heart className="w-4 h-4 mr-2" />
                    Average Mood
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pink-800 dark:text-pink-200">{profile.stats.averageMood.toFixed(1)}/5</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-purple-700 dark:text-purple-300">
                    <Target className="w-4 h-4 mr-2" />
                    Longest Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">{profile.stats.longestStreak} days</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                  <Hash className="w-4 h-4 mr-2" />
                  Favorite Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.stats.favoriteTags.length > 0 ? (
                    profile.stats.favoriteTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-700">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No favorite tags yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 border-slate-200 dark:border-slate-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-700 dark:text-slate-300">Appearance</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Customize how the app looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-700 dark:text-slate-300">Theme</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Choose your preferred theme</p>
                  </div>
                  <Select value={settings.theme} onValueChange={(value: 'light' | 'dark' | 'system') => setSettings({ ...settings, theme: value })}>
                    <SelectTrigger className="w-32 border-slate-200 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-700 dark:text-slate-300">Language</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Select your preferred language</p>
                  </div>
                  <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                    <SelectTrigger className="w-32 border-slate-200 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-300">Privacy</CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">Control who can see your content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-blue-700 dark:text-blue-300">Privacy Level</Label>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Set your default privacy level</p>
                  </div>
                  <Select value={settings.privacy} onValueChange={(value: 'public' | 'private' | 'friends') => setSettings({ ...settings, privacy: value })}>
                    <SelectTrigger className="w-32 border-blue-200 dark:border-blue-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-blue-700 dark:text-blue-300">Notifications</Label>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Receive notifications about your diary</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-300">Data & Export</CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">Manage your data and export preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-green-700 dark:text-green-300">Auto Save</Label>
                    <p className="text-sm text-green-600 dark:text-green-400">Automatically save your entries</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-green-700 dark:text-green-300">Export Format</Label>
                    <p className="text-sm text-green-600 dark:text-green-400">Choose your preferred export format</p>
                  </div>
                  <Select value={settings.exportFormat} onValueChange={(value: 'json' | 'pdf' | 'txt') => setSettings({ ...settings, exportFormat: value })}>
                    <SelectTrigger className="w-32 border-green-200 dark:border-green-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="txt">Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}; 