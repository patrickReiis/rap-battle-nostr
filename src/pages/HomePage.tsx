import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Music, Trophy } from 'lucide-react';
import { LoginArea } from '@/components/auth/LoginArea';

export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Nostr Rap Studio</h1>
        <LoginArea />
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-4">Practice Freestyling with Random Beats</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate random beats, practice your freestyle skills, and share your best raps on Nostr.
        </p>
      </div>

      <div className="grid md:grid-cols-1 gap-6 mb-12">
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
              <li>• Practice your freestyle skills</li>
              <li>• Write and record your bars</li>
              <li>• Share your raps on Nostr</li>
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