import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginModal } from '@/components/LoginModal';
import { Book, Heart, Shield, Sparkles, ArrowRight, Users, Calendar, Target } from 'lucide-react';

export const Landing = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const features = [
    {
      icon: <Book className="w-6 h-6" />,
      title: "Personal Diary",
      description: "Write your thoughts, feelings, and memories in a beautiful, private space."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Mood Tracking",
      description: "Track your emotional journey and discover patterns in your well-being."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal Setting",
      description: "Set personal goals and track your progress with visual insights."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Daily Streaks",
      description: "Build healthy habits with streak tracking and motivation."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy First",
      description: "Your thoughts are yours alone. Complete privacy and security."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Beautiful Design",
      description: "Enjoy a delightful writing experience with our modern interface."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Header */}
      <header className="bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-pink-200 dark:from-orange-600 dark:to-pink-600 rounded-full flex items-center justify-center">
              <Book className="w-5 h-5 text-orange-700 dark:text-orange-200" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground font-serif">Thought Nest</h1>
              <p className="text-sm text-muted-foreground">Your safe space for thoughts</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsLoginModalOpen(true)}
              className="border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950/50"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-pink-200 dark:from-orange-600 dark:to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Book className="w-12 h-12 text-orange-700 dark:text-orange-200" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 font-serif">
              Your Safe Space for
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent"> Thoughts</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Capture your thoughts, track your mood, and build meaningful habits in a beautiful, 
              private diary that grows with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-lg px-8 py-6"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950/50 text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">1M+</div>
              <div className="text-muted-foreground">Entries Written</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Everything you need for your
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent"> personal growth</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thought Nest provides all the tools you need to reflect, grow, and build better habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-background/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/50 dark:to-pink-900/50 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-orange-600 dark:text-orange-400">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to start your journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already building better habits and tracking their growth.
          </p>
          <Button 
            size="lg"
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-6"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background/90 backdrop-blur-md border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-200 to-pink-200 dark:from-orange-600 dark:to-pink-600 rounded-full flex items-center justify-center">
                <Book className="w-4 h-4 text-orange-700 dark:text-orange-200" />
              </div>
              <span className="font-semibold text-foreground">Thought Nest</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Thought Nest. Made with ❤️ for personal growth.
            </div>
          </div>
        </div>
      </footer>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}; 