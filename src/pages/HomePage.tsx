import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Music, Users, Trophy } from 'lucide-react';
import { LoginArea } from '@/components/auth/LoginArea';

export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Nostr Rap Battles</h1>
        <LoginArea />
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-4">Battle with Random Beats on Nostr</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate random beats, drop your bars, and compete with other rappers in the decentralized rap battle arena.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Solo Practice
            </CardTitle>
            <CardDescription>
              Generate a random beat and practice your freestyle skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/practice">
              <Button className="w-full" size="lg">
                Start Practicing
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Live Battles
            </CardTitle>
            <CardDescription>
              Join or create a rap battle room and compete with others
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/battles">
              <Button className="w-full" size="lg" variant="secondary">
                Enter Battle Arena
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Generate a random beat</li>
              <li>• Write your bars to the beat</li>
              <li>• Post your rap on Nostr</li>
              <li>• Vote for the best rapper</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/leaderboard">
              <Button variant="outline" className="w-full">
                View Top Rappers
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Beat Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/beats">
              <Button variant="outline" className="w-full">
                Browse All Beats
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}