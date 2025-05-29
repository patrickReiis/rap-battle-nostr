import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Mic, Shuffle } from 'lucide-react';
import { BeatPlayer } from '@/components/BeatPlayer';
import { generateRandomBeat, Beat, BEAT_SAMPLES, getRandomBeatByStyle } from '@/lib/beats';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useToast } from '@/hooks/use-toast';
import { LoginArea } from '@/components/auth/LoginArea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBeatEmoji, BEAT_STYLES } from '@/lib/beats';

export function PracticePage() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const { mutate: publishRap, isPending } = useNostrPublish();
  
  const [beat, setBeat] = useState<Beat>(generateRandomBeat());
  const [lyrics, setLyrics] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('random');

  const handleGenerateNewBeat = () => {
    if (selectedStyle === 'random') {
      setBeat(generateRandomBeat());
    } else {
      const styleBeat = getRandomBeatByStyle(selectedStyle);
      if (styleBeat) {
        setBeat(styleBeat);
      } else {
        // Fallback to any random beat if no beats for that style
        setBeat(generateRandomBeat());
      }
    }
    setLyrics('');
  };

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    if (style === 'random') {
      setBeat(generateRandomBeat());
    } else {
      const styleBeat = getRandomBeatByStyle(style);
      if (styleBeat) {
        setBeat(styleBeat);
      }
    }
  };

  const handlePublishRap = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to publish your rap",
        variant: "destructive"
      });
      return;
    }

    if (!lyrics.trim()) {
      toast({
        title: "No Lyrics",
        description: "Please write some bars before publishing",
        variant: "destructive"
      });
      return;
    }

    const content = `🎤 Freestyle Rap Practice 🎤\n\nBeat: ${beat.name}\nStyle: ${beat.style} @ ${beat.bpm} BPM\n\n${lyrics}\n\n#nostrRapBattle #freestyle #hiphop`;

    publishRap(
      { 
        kind: 1, 
        content,
        tags: [
          ['t', 'nostrRapBattle'],
          ['t', 'freestyle'],
          ['t', 'hiphop'],
          ['L', 'rap-battle'],
          ['l', 'practice', 'rap-battle'],
          ['beat-style', beat.style],
          ['beat-bpm', beat.bpm.toString()],
        ]
      },
      {
        onSuccess: () => {
          toast({
            title: "Rap Published!",
            description: "Your freestyle has been posted to Nostr",
          });
          setLyrics('');
          handleGenerateNewBeat();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to publish your rap. Please try again.",
            variant: "destructive"
          });
          console.error('Failed to publish:', error);
        }
      }
    );
  };

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
          <h1 className="text-3xl font-bold mb-2">Freestyle Practice</h1>
          <p className="text-muted-foreground">
            Generate a random beat and practice your freestyle skills
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Select value={selectedStyle} onValueChange={handleStyleChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select beat style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">
                  <span className="flex items-center gap-2">
                    <Shuffle className="h-4 w-4" />
                    Random Style
                  </span>
                </SelectItem>
                {BEAT_STYLES.map(style => (
                  <SelectItem key={style} value={style}>
                    <span className="flex items-center gap-2">
                      {getBeatEmoji(style)} {style}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <BeatPlayer beat={beat} onGenerateNew={handleGenerateNewBeat} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Your Bars
            </CardTitle>
            <CardDescription>
              Write your lyrics to the beat. When you're ready, publish them to Nostr!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Drop your bars here... 🎤

Example:
Yo, I'm on the mic with the Nostr flow
Decentralized bars, watch me steal the show
No central server can silence my voice
Freedom of speech, that's my only choice..."
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              className="min-h-[200px] font-mono"
            />

            <div className="flex gap-2">
              <Button
                onClick={handlePublishRap}
                disabled={!lyrics.trim() || isPending || !user}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                {isPending ? 'Publishing...' : 'Publish to Nostr'}
              </Button>
            </div>

            {!user && (
              <p className="text-sm text-muted-foreground text-center">
                Please login to publish your rap
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tips for Freestyling</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Listen to the beat pattern and find the rhythm</li>
              <li>• Start simple with basic rhyme schemes (AABB, ABAB)</li>
              <li>• Use the beat style as inspiration for your flow</li>
              <li>• Don't overthink it - let the words flow naturally</li>
              <li>• Practice makes perfect - keep generating new beats!</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}