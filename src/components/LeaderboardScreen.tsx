import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Trophy, Zap, Target, Gamepad2, RefreshCw, Crown, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLeaderboard, getUserRank, type LeaderboardType, type LeaderboardEntry } from '@/lib/leaderboards';

interface LeaderboardScreenProps {
  onBack: () => void;
}

const LEADERBOARD_TABS: { id: LeaderboardType; label: string; icon: typeof Trophy; color: string }[] = [
  { id: 'total_xp', label: 'Total XP', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { id: 'weekly_xp', label: 'This Week', icon: Target, color: 'from-green-500 to-emerald-500' },
  { id: 'quiz_avg', label: 'Quiz Scores', icon: Trophy, color: 'from-purple-500 to-pink-500' },
  { id: 'games', label: 'Game Scores', icon: Gamepad2, color: 'from-blue-500 to-cyan-500' },
];

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('total_xp');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<{ rank: number | null; value: number; totalUsers: number }>({
    rank: null,
    value: 0,
    totalUsers: 0
  });

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    const [leaderboardData, rankData] = await Promise.all([
      getLeaderboard(activeTab, 100),
      getUserRank(activeTab)
    ]);
    setEntries(leaderboardData);
    setUserRank(rankData);
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-white/60 font-bold text-sm">#{rank}</span>;
  };

  const getValueLabel = (type: LeaderboardType) => {
    switch (type) {
      case 'total_xp':
      case 'weekly_xp':
        return 'XP';
      case 'quiz_avg':
        return 'Avg Score';
      case 'games':
        return 'High Score';
    }
  };

  const formatValue = (value: number, type: LeaderboardType) => {
    if (type === 'quiz_avg') {
      return `${value}/10`;
    }
    return value.toLocaleString();
  };

  const activeTabConfig = LEADERBOARD_TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-[#0A0E27]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0A0E27]/95 backdrop-blur-sm border-b border-white/5 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-bold text-lg">Leaderboards</h1>
          <button
            onClick={loadLeaderboard}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={cn("w-5 h-5 text-white", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {LEADERBOARD_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all",
                  isActive
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Your Rank Card */}
        {userRank.rank && (
          <div className={cn(
            "bg-gradient-to-r p-4 rounded-xl relative overflow-hidden",
            activeTabConfig.color
          )}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Your Rank</p>
                <p className="text-white text-3xl font-black">#{userRank.rank}</p>
                <p className="text-white/60 text-xs">of {userRank.totalUsers} users</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">{getValueLabel(activeTab)}</p>
                <p className="text-white text-2xl font-bold">{formatValue(userRank.value, activeTab)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="bg-white/5 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-white/40 animate-spin" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60">No data yet</p>
              <p className="text-white/40 text-sm">Be the first on the leaderboard!</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {entries.map((entry) => (
                <div
                  key={entry.user_id}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 transition-colors",
                    entry.is_current_user && "bg-white/10"
                  )}
                >
                  {/* Rank */}
                  <div className="w-10 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium truncate",
                      entry.is_current_user ? "text-yellow-400" : "text-white"
                    )}>
                      {entry.display_name || entry.email.split('@')[0]}
                      {entry.is_current_user && " (You)"}
                    </p>
                    {entry.rank <= 3 && (
                      <p className="text-white/40 text-xs">
                        {entry.rank === 1 ? '1st Place' : entry.rank === 2 ? '2nd Place' : '3rd Place'}
                      </p>
                    )}
                  </div>

                  {/* Value */}
                  <div className="text-right">
                    <p className={cn(
                      "font-bold",
                      entry.rank === 1 ? "text-yellow-400" :
                      entry.rank === 2 ? "text-gray-300" :
                      entry.rank === 3 ? "text-amber-600" :
                      "text-white"
                    )}>
                      {formatValue(entry.value, activeTab)}
                    </p>
                    <p className="text-white/40 text-xs">{getValueLabel(activeTab)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard Info */}
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">How it works</h3>
          <div className="space-y-2 text-sm text-white/60">
            {activeTab === 'total_xp' && (
              <p>Earn XP by completing lessons, passing quizzes, and playing games. Your total XP determines your rank!</p>
            )}
            {activeTab === 'weekly_xp' && (
              <p>Weekly leaderboard resets every Monday. Compete for the top spot each week!</p>
            )}
            {activeTab === 'quiz_avg' && (
              <p>Complete at least 3 quizzes to appear on this leaderboard. Your average score determines your rank.</p>
            )}
            {activeTab === 'games' && (
              <p>Your highest score across all games determines your rank. Play more games to improve!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
