import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';

export interface BattleRoomData {
  id: string;
  name: string;
  creatorPubkey: string;
  participants: string[];
  status: 'waiting' | 'active' | 'completed';
  currentRound: number;
  maxRounds: number;
  scores: Record<string, number>;
}

export function useBattleRoom(roomId: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['battleRoom', roomId],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      
      // Fetch room events and participant events
      const events = await nostr.query(
        [
          { 
            kinds: [1],
            '#L': ['rap-battle'],
            '#l': ['join', 'rap-battle'],
            '#room-id': [roomId],
            limit: 100
          }
        ], 
        { signal }
      );

      // Extract unique participants
      const participants = [...new Set(events.map(e => e.pubkey))];

      // Calculate scores based on votes (reactions)
      const voteEvents = await nostr.query(
        [
          {
            kinds: [7],
            '#L': ['rap-battle'],
            '#l': ['vote', 'rap-battle'],
            '#room-id': [roomId],
          }
        ],
        { signal }
      );

      const scores: Record<string, number> = {};
      participants.forEach(p => scores[p] = 0);

      // Count votes for each participant
      voteEvents.forEach(vote => {
        const votedEventId = vote.tags.find(t => t[0] === 'e')?.[1];
        if (votedEventId) {
          const votedEvent = events.find(e => e.id === votedEventId);
          if (votedEvent && scores[votedEvent.pubkey] !== undefined) {
            scores[votedEvent.pubkey]++;
          }
        }
      });

      const roomData: BattleRoomData = {
        id: roomId,
        name: 'Battle Room', // This would come from the room creation event
        creatorPubkey: participants[0] || '',
        participants,
        status: participants.length >= 2 ? 'active' : 'waiting',
        currentRound: 1,
        maxRounds: 3,
        scores,
      };

      return roomData;
    },
    refetchInterval: 5000, // Refetch every 5 seconds for live updates
  });
}