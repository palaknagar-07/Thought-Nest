import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials, RegisterData } from '@/types/auth';
import { Eye, EyeOff, Loader2, Book, Mail, Lock, User, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    login: { email: '', password: '' },
    register: { username: '', email: '', password: '', confirmPassword: '', firstName: '', lastName: '' }
  });

  const { login, register, isLoading, error, clearError } = useAuth();

  const handleInputChange = (form: 'login' | 'register', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [form]: { ...prev[form], [field]: value }
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const credentials: LoginCredentials = {
      email: formData.login.email,
      password: formData.login.password
    };

    try {
      await login(credentials);
      onClose();
      setFormData(prev => ({ ...prev, login: { email: '', password: '' } }));
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const registerData: RegisterData = {
      username: formData.register.username,
      email: formData.register.email,
      password: formData.register.password,
      confirmPassword: formData.register.confirmPassword,
      firstName: formData.register.firstName,
      lastName: formData.register.lastName
    };

    try {
      await register(registerData);
      onClose();
      setFormData(prev => ({ 
        ...prev, 
        register: { username: '', email: '', password: '', confirmPassword: '', firstName: '', lastName: '' } 
      }));
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-background/95 backdrop-blur-md border-border/50">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-pink-200 dark:from-orange-600 dark:to-pink-600 rounded-full flex items-center justify-center">
              <Book className="w-8 h-8 text-orange-700 dark:text-orange-200" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to Thought Nest
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Your safe space for thoughts and memories
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border/50">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Register
            </TabsTrigger>
          </TabsList>

          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-700 dark:text-red-300">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm font-medium text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.login.email}
                    onChange={(e) => handleInputChange('login', 'email', e.target.value)}
                    className="pl-10 border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.login.password}
                    onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                    className="pl-10 pr-10 border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Demo account: demo@example.com / demo123
                </p>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="register-firstName" className="text-sm font-medium text-foreground">
                    First Name
                  </Label>
                  <Input
                    id="register-firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.register.firstName}
                    onChange={(e) => handleInputChange('register', 'firstName', e.target.value)}
                    className="border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-lastName" className="text-sm font-medium text-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="register-lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.register.lastName}
                    onChange={(e) => handleInputChange('register', 'lastName', e.target.value)}
                    className="border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-username" className="text-sm font-medium text-foreground">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.register.username}
                    onChange={(e) => handleInputChange('register', 'username', e.target.value)}
                    className="pl-10 border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-sm font-medium text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.register.email}
                    onChange={(e) => handleInputChange('register', 'email', e.target.value)}
                    className="pl-10 border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.register.password}
                    onChange={(e) => handleInputChange('register', 'password', e.target.value)}
                    className="pl-10 pr-10 border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.register.confirmPassword}
                    onChange={(e) => handleInputChange('register', 'confirmPassword', e.target.value)}
                    className="pl-10 pr-10 border-orange-200 focus:border-orange-500 dark:border-orange-700 dark:focus:border-orange-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}; 