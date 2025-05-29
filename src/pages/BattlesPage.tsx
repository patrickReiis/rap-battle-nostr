import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Users, Clock, Trophy } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useBattleRooms } from '@/hooks/useBattleRooms';
import { LoginArea } from '@/components/auth/LoginArea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export function BattlesPage() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const { data: rooms, isLoading } = useBattleRooms();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [maxRounds, setMaxRounds] = useState('3');

  const handleCreateRoom = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to create a battle room",
        variant: "destructive"
      });
      return;
    }
    setShowCreateDialog(true);
  };

  const handleConfirmCreate = () => {
    if (!roomName.trim()) {
      toast({
        title: "Room Name Required",
        description: "Please enter a name for your battle room",
        variant: "destructive"
      });
      return;
    }

    // Navigate to the new room
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    navigate(`/battle/${roomId}?name=${encodeURIComponent(roomName)}&rounds=${maxRounds}`);
    setShowCreateDialog(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
          <h1 className="text-3xl font-bold mb-2">Battle Arena</h1>
          <p className="text-muted-foreground">
            Join a live rap battle or create your own room
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleCreateRoom} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Battle Room
          </Button>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : rooms && rooms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <Card key={room.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/battle/${room.id}`)}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{room.name}</span>
                    {room.status === 'active' && (
                      <Badge variant="default" className="ml-2">Live</Badge>
                    )}
                    {room.status === 'waiting' && (
                      <Badge variant="secondary" className="ml-2">Waiting</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Created by {room.creatorName || 'Anonymous'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{room.participants} / {room.maxParticipants} rappers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{room.rounds} rounds</span>
                    </div>
                    {room.winner && (
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span>Winner: {room.winner}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Battles</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to create a battle room!
              </p>
              <Button onClick={handleCreateRoom}>
                Create First Battle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Battle Room</DialogTitle>
            <DialogDescription>
              Set up your rap battle room. Other users can join and compete!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-name">Room Name</Label>
              <Input
                id="room-name"
                placeholder="Epic Rap Battle Room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-rounds">Number of Rounds</Label>
              <Input
                id="max-rounds"
                type="number"
                min="1"
                max="10"
                value={maxRounds}
                onChange={(e) => setMaxRounds(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCreate}>
              Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}