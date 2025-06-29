import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { UserStats } from './UserStats';

export const WelcomeSection = () => {
  const today = new Date();
  const greeting = getGreeting();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2 font-serif">
          {greeting}, {user.firstName}! ✨
        </h2>
        <p className="text-lg text-muted-foreground mb-1">
          Today is {format(today, 'EEEE, MMMM do, yyyy')}
        </p>
        <p className="text-sm text-muted-foreground/70 italic">
          "Every day is a blank page in your story. What will you write today?"
        </p>
      </div>
      
      <UserStats profile={user} />
    </div>
  );
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
