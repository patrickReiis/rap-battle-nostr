import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import { NostrEvent } from '@nostrify/nostrify';

export interface BattleRoom {
  id: string;
  name: string;
  creatorPubkey: string;
  creatorName?: string;
  status: 'waiting' | 'active' | 'completed';
  participants: number;
  maxParticipants: number;
  rounds: number;
  currentRound?: number;
  winner?: string;
  createdAt: number;
}

const BATTLE_ROOM_KIND = 30023; // Parameterized replaceable event

export function useBattleRooms() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['battleRooms'],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      
      // Fetch battle room events
      const events = await nostr.query(
        [{ 
          kinds: [BATTLE_ROOM_KIND],
          '#L': ['rap-battle'],
          '#l': ['room', 'rap-battle'],
          limit: 50
        }], 
        { signal }
      );

      // Fetch metadata for creators
      const pubkeys = [...new Set(events.map(e => e.pubkey))];
      const metadataEvents = pubkeys.length > 0 ? await nostr.query(
        [{ kinds: [0], authors: pubkeys }],
        { signal }
      ) : [];

      const metadataMap = new Map<string, { name?: string; display_name?: string }>();
      metadataEvents.forEach(event => {
        try {
          const metadata = JSON.parse(event.content);
          metadataMap.set(event.pubkey, metadata);
        } catch (e) {
          console.error('Failed to parse metadata:', e);
        }
      });

      // Transform events into BattleRoom objects
      const rooms: BattleRoom[] = events.map(event => {
        const metadata = metadataMap.get(event.pubkey);
        const tags = event.tags;
        
        // Extract room data from tags
        const getName = () => tags.find(t => t[0] === 'title')?.[1] || 'Unnamed Battle';
        const getStatus = () => tags.find(t => t[0] === 'status')?.[1] as BattleRoom['status'] || 'waiting';
        const getParticipants = () => parseInt(tags.find(t => t[0] === 'participants')?.[1] || '0');
        const getMaxParticipants = () => parseInt(tags.find(t => t[0] === 'max-participants')?.[1] || '2');
        const getRounds = () => parseInt(tags.find(t => t[0] === 'rounds')?.[1] || '3');
        const getCurrentRound = () => {
          const round = tags.find(t => t[0] === 'current-round')?.[1];
          return round ? parseInt(round) : undefined;
        };
        const getWinner = () => tags.find(t => t[0] === 'winner')?.[1];
        const getRoomId = () => tags.find(t => t[0] === 'd')?.[1] || event.id;

        return {
          id: getRoomId(),
          name: getName(),
          creatorPubkey: event.pubkey,
          creatorName: metadata?.name || metadata?.display_name,
          status: getStatus(),
          participants: getParticipants(),
          maxParticipants: getMaxParticipants(),
          rounds: getRounds(),
          currentRound: getCurrentRound(),
          winner: getWinner(),
          createdAt: event.created_at,
        };
      });

      // Sort by creation time (newest first) and status (active/waiting first)
      return rooms.sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        return b.createdAt - a.createdAt;
      });
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}