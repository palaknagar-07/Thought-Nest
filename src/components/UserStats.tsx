import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthUser } from '@/types/auth';
import { TrendingUp, Target, Heart, Hash, Calendar } from 'lucide-react';

interface UserStatsProps {
  profile: AuthUser;
}

export const UserStats = ({ profile }: UserStatsProps) => {
  const { stats } = profile;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-orange-50/80 to-pink-50/80 dark:from-orange-950/40 dark:to-pink-950/40 backdrop-blur-sm border-orange-200/60 dark:border-orange-800/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center text-orange-700 dark:text-orange-300">
            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/50 rounded-lg mr-2">
              <TrendingUp className="w-4 h-4" />
            </div>
            Total Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">{stats.totalEntries}</div>
          <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">diary entries</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-950/40 dark:to-cyan-950/40 backdrop-blur-sm border-blue-200/60 dark:border-blue-800/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center text-blue-700 dark:text-blue-300">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg mr-2">
              <Target className="w-4 h-4" />
            </div>
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{stats.streakDays} days</div>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">writing streak</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-pink-50/80 to-rose-50/80 dark:from-pink-950/40 dark:to-rose-950/40 backdrop-blur-sm border-pink-200/60 dark:border-pink-800/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center text-pink-700 dark:text-pink-300">
            <div className="p-1.5 bg-pink-100 dark:bg-pink-900/50 rounded-lg mr-2">
              <Heart className="w-4 h-4" />
            </div>
            Average Mood
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pink-800 dark:text-pink-200">{stats.averageMood.toFixed(1)}/5</div>
          <p className="text-xs text-pink-600/70 dark:text-pink-400/70 mt-1">mood score</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50/80 to-violet-50/80 dark:from-purple-950/40 dark:to-violet-950/40 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center text-purple-700 dark:text-purple-300">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg mr-2">
              <Calendar className="w-4 h-4" />
            </div>
            Longest Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">{stats.longestStreak} days</div>
          <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">best streak</p>
        </CardContent>
      </Card>
    </div>
  );
}; 