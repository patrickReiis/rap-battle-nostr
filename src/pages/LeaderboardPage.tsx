import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useAuthor } from '@/hooks/useAuthor';
import { LoginArea } from '@/components/auth/LoginArea';

interface RapperRowProps {
  pubkey: string;
  stats: {
    wins: number;
    battles: number;
    votes: number;
  };
  rank: number;
}

function RapperRow({ pubkey, stats, rank }: RapperRowProps) {
  const author = useAuthor(pubkey);
  const metadata = author.data?.metadata;

  const getRankIcon = () => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-600" />;
      default:
        return <span className="text-muted-foreground">#{rank}</span>;
    }
  };

  const winRate = stats.battles > 0 ? Math.round((stats.wins / stats.battles) * 100) : 0;

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/50 rounded-lg transition-colors">
      <div className="flex-shrink-0 w-8 text-center">
        {getRankIcon()}
      </div>
      
      <Avatar className="h-10 w-10">
        <AvatarImage src={metadata?.picture} />
        <AvatarFallback>{metadata?.name?.[0] || '?'}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <p className="font-semibold">{metadata?.name || pubkey.slice(0, 8)}</p>
        <p className="text-sm text-muted-foreground">
          {stats.wins} wins • {winRate}% win rate
        </p>
      </div>

      <div className="text-right">
        <p className="font-semibold">{stats.votes} votes</p>
        <p className="text-sm text-muted-foreground">{stats.battles} battles</p>
      </div>
    </div>
  );
}

export function LeaderboardPage() {
  const navigate = useNavigate();
  const { data: leaderboard, isLoading } = useLeaderboard();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <LoginArea />
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Rap Battle Leaderboard</h1>
          <p className="text-muted-foreground">
            Top rappers ranked by wins and community votes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Total Battles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{leaderboard?.totalBattles || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Active Rappers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{leaderboard?.totalRappers || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Total Votes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{leaderboard?.totalVotes || 0}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Rappers</CardTitle>
            <CardDescription>
              Ranked by battle wins and community votes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-8 h-8 bg-muted rounded"></div>
                    <div className="h-10 w-10 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-16"></div>
                      <div className="h-3 bg-muted rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : leaderboard?.rappers && leaderboard.rappers.length > 0 ? (
              <div className="divide-y">
                {leaderboard.rappers.map((rapper, index) => (
                  <RapperRow
                    key={rapper.pubkey}
                    pubkey={rapper.pubkey}
                    stats={rapper.stats}
                    rank={index + 1}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No battles completed yet. Be the first champion!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {leaderboard?.rappers && leaderboard.rappers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Hall of Fame</CardTitle>
              <CardDescription>
                Legendary performances and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Most Wins</Badge>
                  <span className="text-sm">
                    {leaderboard.rappers[0]?.stats.wins || 0} victories
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Most Voted</Badge>
                  <span className="text-sm">
                    {Math.max(...leaderboard.rappers.map(r => r.stats.votes))} votes
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Battle Veteran</Badge>
                  <span className="text-sm">
                    {Math.max(...leaderboard.rappers.map(r => r.stats.battles))} battles
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}