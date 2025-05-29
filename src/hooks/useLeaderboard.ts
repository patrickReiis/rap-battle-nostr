import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';

export interface RapperStats {
  pubkey: string;
  stats: {
    wins: number;
    battles: number;
    votes: number;
  };
}

export interface LeaderboardData {
  rappers: RapperStats[];
  totalBattles: number;
  totalRappers: number;
  totalVotes: number;
}

export function useLeaderboard() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      
      // Fetch all battle-related events
      const [battleEvents, voteEvents] = await Promise.all([
        nostr.query(
          [
            { 
              kinds: [1],
              '#L': ['rap-battle'],
              '#l': ['battle-rap', 'rap-battle'],
              limit: 500
            }
          ], 
          { signal }
        ),
        nostr.query(
          [
            {
              kinds: [7],
              '#L': ['rap-battle'],
              '#l': ['vote', 'rap-battle'],
              limit: 1000
            }
          ],
          { signal }
        )
      ]);

      // Build stats for each rapper
      const rapperStatsMap = new Map<string, RapperStats['stats']>();

      // Count battles per rapper
      battleEvents.forEach(event => {
        const pubkey = event.pubkey;
        if (!rapperStatsMap.has(pubkey)) {
          rapperStatsMap.set(pubkey, { wins: 0, battles: 0, votes: 0 });
        }
        const stats = rapperStatsMap.get(pubkey)!;
        stats.battles++;
      });

      // Count votes for each rapper
      const votesByEvent = new Map<string, number>();
      voteEvents.forEach(vote => {
        const votedEventId = vote.tags.find(t => t[0] === 'e')?.[1];
        if (votedEventId) {
          votesByEvent.set(votedEventId, (votesByEvent.get(votedEventId) || 0) + 1);
        }
      });

      // Apply votes to rappers
      battleEvents.forEach(event => {
        const votes = votesByEvent.get(event.id) || 0;
        const stats = rapperStatsMap.get(event.pubkey);
        if (stats) {
          stats.votes += votes;
        }
      });

      // Group battles by room and determine winners
      const battlesByRoom = new Map<string, typeof battleEvents>();
      battleEvents.forEach(event => {
        const roomId = event.tags.find(t => t[0] === 'room-id')?.[1];
        if (roomId) {
          if (!battlesByRoom.has(roomId)) {
            battlesByRoom.set(roomId, []);
          }
          battlesByRoom.get(roomId)!.push(event);
        }
      });

      // Determine winners for each room
      battlesByRoom.forEach((roomBattles) => {
        if (roomBattles.length < 2) return; // Need at least 2 participants

        // Find rapper with most votes in this room
        let winner = { pubkey: '', votes: 0 };
        const roomVotes = new Map<string, number>();

        roomBattles.forEach(battle => {
          const votes = votesByEvent.get(battle.id) || 0;
          roomVotes.set(battle.pubkey, (roomVotes.get(battle.pubkey) || 0) + votes);
        });

        roomVotes.forEach((votes, pubkey) => {
          if (votes > winner.votes) {
            winner = { pubkey, votes };
          }
        });

        // Award win to the winner
        if (winner.pubkey && rapperStatsMap.has(winner.pubkey)) {
          rapperStatsMap.get(winner.pubkey)!.wins++;
        }
      });

      // Convert to array and sort by wins, then votes
      const rappers: RapperStats[] = Array.from(rapperStatsMap.entries())
        .map(([pubkey, stats]) => ({ pubkey, stats }))
        .sort((a, b) => {
          if (b.stats.wins !== a.stats.wins) {
            return b.stats.wins - a.stats.wins;
          }
          return b.stats.votes - a.stats.votes;
        })
        .slice(0, 50); // Top 50 rappers

      const leaderboardData: LeaderboardData = {
        rappers,
        totalBattles: battlesByRoom.size,
        totalRappers: rapperStatsMap.size,
        totalVotes: voteEvents.length,
      };

      return leaderboardData;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}