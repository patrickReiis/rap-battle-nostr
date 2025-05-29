import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Users, Clock, Trophy, ThumbsUp } from 'lucide-react';
import { BeatPlayer } from '@/components/BeatPlayer';
import { generateRandomBeat, Beat, BEAT_SAMPLES } from '@/lib/beats';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useBattleRoom } from '@/hooks/useBattleRoom';
import { useBattleMessages } from '@/hooks/useBattleMessages';
import { useToast } from '@/hooks/use-toast';
import { LoginArea } from '@/components/auth/LoginArea';
import { NoteContent } from '@/components/NoteContent';
import { useAuthor } from '@/hooks/useAuthor';

interface RapperCardProps {
  pubkey: string;
  score: number;
  isActive: boolean;
}

function RapperCard({ pubkey, score, isActive }: RapperCardProps) {
  const author = useAuthor(pubkey);
  const metadata = author.data?.metadata;

  return (
    <Card className={isActive ? 'ring-2 ring-primary' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={metadata?.picture} />
            <AvatarFallback>{metadata?.name?.[0] || '?'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{metadata?.name || pubkey.slice(0, 8)}</p>
            <p className="text-sm text-muted-foreground">Score: {score}</p>
          </div>
          {isActive && <Badge>Active</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}

export function BattleRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const { mutate: publishEvent, isPending } = useNostrPublish();
  
  const roomName = searchParams.get('name') || 'Battle Room';
  const maxRounds = parseInt(searchParams.get('rounds') || '3');
  
  const { data: room, isLoading: roomLoading } = useBattleRoom(roomId!);
  const { data: messages, isLoading: messagesLoading } = useBattleMessages(roomId!);
  
  const [beat, setBeat] = useState<Beat>(generateRandomBeat());
  const [lyrics, setLyrics] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Check if user has joined
    if (user && room) {
      setIsJoined(room.participants.includes(user.pubkey));
    }
  }, [user, room]);

  const handleJoinBattle = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to join the battle",
        variant: "destructive"
      });
      return;
    }

    publishEvent(
      {
        kind: 1,
        content: `Joined the rap battle: ${roomName} 🎤`,
        tags: [
          ['L', 'rap-battle'],
          ['l', 'join', 'rap-battle'],
          ['room-id', roomId!],
          ['t', 'nostrRapBattle'],
        ]
      },
      {
        onSuccess: () => {
          setIsJoined(true);
          toast({
            title: "Joined Battle!",
            description: "You're now part of this rap battle",
          });
        }
      }
    );
  };

  const handleSubmitRap = () => {
    if (!lyrics.trim()) {
      toast({
        title: "No Lyrics",
        description: "Please write some bars before submitting",
        variant: "destructive"
      });
      return;
    }

    const content = `🎤 Battle Rap - Round ${currentRound} 🎤\n\nBeat: ${beat.name}\n\n${lyrics}\n\n#nostrRapBattle`;

    publishEvent(
      {
        kind: 1,
        content,
        tags: [
          ['L', 'rap-battle'],
          ['l', 'battle-rap', 'rap-battle'],
          ['room-id', roomId!],
          ['round', currentRound.toString()],
          ['beat-style', beat.style],
          ['beat-bpm', beat.bpm.toString()],
          ['t', 'nostrRapBattle'],
        ]
      },
      {
        onSuccess: () => {
          toast({
            title: "Rap Submitted!",
            description: "Your bars have been dropped",
          });
          setLyrics('');
          // Generate new beat for next round
          setBeat(generateRandomBeat());
        }
      }
    );
  };

  const handleVote = (eventId: string) => {
    publishEvent(
      {
        kind: 7, // Reaction
        content: '+',
        tags: [
          ['e', eventId],
          ['L', 'rap-battle'],
          ['l', 'vote', 'rap-battle'],
          ['room-id', roomId!],
        ]
      },
      {
        onSuccess: () => {
          toast({
            title: "Vote Cast!",
            description: "Your vote has been recorded",
          });
        }
      }
    );
  };

  if (roomLoading || messagesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/battles')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Battles
        </Button>
        <LoginArea />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Battle Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{roomName}</span>
                <Badge variant="outline">Round {currentRound} / {maxRounds}</Badge>
              </CardTitle>
              <CardDescription>
                Battle ID: {roomId}
              </CardDescription>
            </CardHeader>
          </Card>

          <BeatPlayer beat={beat} />

          {isJoined ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Turn</CardTitle>
                <CardDescription>
                  Listen to the beat and drop your best bars!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Write your rap here..."
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  className="min-h-[150px] font-mono"
                />
                <Button
                  onClick={handleSubmitRap}
                  disabled={!lyrics.trim() || isPending}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isPending ? 'Submitting...' : 'Submit Rap'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Join the Battle</h3>
                <p className="text-muted-foreground mb-4">
                  {user ? 'Click below to join this rap battle!' : 'Login to join this battle'}
                </p>
                <Button onClick={handleJoinBattle} disabled={!user}>
                  Join Battle
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Battle Messages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Battle Raps</h3>
            {messages && messages.length > 0 ? (
              messages.map((message) => (
                <Card key={message.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <RapperInfo pubkey={message.pubkey} />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote(message.id)}
                        disabled={!user || !isJoined}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Vote
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <NoteContent event={message} className="whitespace-pre-wrap" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8 text-muted-foreground">
                  No raps yet. Be the first to drop some bars!
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              {room?.participants && room.participants.length > 0 ? (
                <div className="space-y-2">
                  {room.participants.map((pubkey) => (
                    <RapperCard
                      key={pubkey}
                      pubkey={pubkey}
                      score={0}
                      isActive={false}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No participants yet
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Battle Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Each rapper gets one verse per round</p>
              <p>• Vote for the best bars after each round</p>
              <p>• Most votes wins the round</p>
              <p>• Winner takes the crown after {maxRounds} rounds</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RapperInfo({ pubkey }: { pubkey: string }) {
  const author = useAuthor(pubkey);
  const metadata = author.data?.metadata;

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={metadata?.picture} />
        <AvatarFallback>{metadata?.name?.[0] || '?'}</AvatarFallback>
      </Avatar>
      <span className="font-medium">{metadata?.name || pubkey.slice(0, 8)}</span>
    </div>
  );
}