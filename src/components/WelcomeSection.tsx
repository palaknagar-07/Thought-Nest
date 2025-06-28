import { format } from 'date-fns';

export const WelcomeSection = () => {
  const today = new Date();
  const greeting = getGreeting();

  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-foreground mb-2 font-serif">
        {greeting}! ✨
      </h2>
      <p className="text-lg text-muted-foreground mb-1">
        Today is {format(today, 'EEEE, MMMM do, yyyy')}
      </p>
      <p className="text-sm text-muted-foreground/70 italic">
        "Every day is a blank page in your story. What will you write today?"
      </p>
    </div>
  );
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
