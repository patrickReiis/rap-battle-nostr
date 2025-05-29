import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import { NostrEvent } from '@nostrify/nostrify';

export function useBattleMessages(roomId: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['battleMessages', roomId],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      
      // Fetch battle rap messages for this room
      const events = await nostr.query(
        [
          { 
            kinds: [1],
            '#L': ['rap-battle'],
            '#l': ['battle-rap', 'rap-battle'],
            '#room-id': [roomId],
            limit: 50
          }
        ], 
        { signal }
      );

      // Sort by creation time (newest first)
      return events.sort((a, b) => b.created_at - a.created_at);
    },
    refetchInterval: 3000, // Refetch every 3 seconds for live updates
  });
}