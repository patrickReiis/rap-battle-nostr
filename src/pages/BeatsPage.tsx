import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Music, Play, Search, ExternalLink, Headphones } from 'lucide-react';
import { BEAT_STYLES, BEAT_SAMPLES, getBeatEmoji, Beat } from '@/lib/beats';
import { BeatPlayer } from '@/components/BeatPlayer';
import { LoginArea } from '@/components/auth/LoginArea';
import { Badge } from '@/components/ui/badge';

export function BeatsPage() {
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  
  const filteredBeats = BEAT_SAMPLES.filter(beat => {
    const matchesStyle = selectedStyle === 'all' || beat.style === selectedStyle;
    const matchesSearch = beat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         beat.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (beat.producer && beat.producer.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStyle && matchesSearch;
  });

  const handlePlayBeat = (beat: Beat) => {
    setCurrentBeat(beat);
    // Remove the scroll to top - let user stay where they are
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const beatCountByStyle = BEAT_STYLES.reduce((acc, style) => {
    acc[style] = BEAT_SAMPLES.filter(beat => beat.style === style).length;
    return acc;
  }, {} as Record<string, number>);

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
          <h1 className="text-3xl font-bold mb-2">Beat Library</h1>
          <p className="text-muted-foreground">
            High-quality beats for your rap battles - all royalty-free!
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Headphones className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {BEAT_SAMPLES.length} professional beats available
            </span>
          </div>
        </div>

        {/* Current Beat Player */}
        {currentBeat && (
          <div className="mb-6 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4">
            <BeatPlayer 
              beat={currentBeat} 
              autoPlay={true}
              onGenerateNew={() => {
                const otherBeats = filteredBeats.filter(b => b.id !== currentBeat.id);
                if (otherBeats.length > 0) {
                  const randomBeat = otherBeats[Math.floor(Math.random() * otherBeats.length)];
                  setCurrentBeat(randomBeat);
                }
              }}
            />
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Beats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search beats, styles, or producers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Styles ({BEAT_SAMPLES.length})
                  </SelectItem>
                  {BEAT_STYLES.map(style => (
                    <SelectItem key={style} value={style}>
                      {getBeatEmoji(style)} {style} ({beatCountByStyle[style] || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Beat Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBeats.map((beat) => (
            <Card 
              key={beat.id} 
              className={`hover:shadow-lg transition-all cursor-pointer ${
                currentBeat?.id === beat.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handlePlayBeat(beat)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">{getBeatEmoji(beat.style)}</span>
                  {beat.name}
                </CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>{beat.style} • {beat.bpm} BPM</span>
                  {beat.audioUrl && (
                    <Badge variant="secondary" className="text-xs">
                      <Music className="h-3 w-3 mr-1" />
                      HQ
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {beat.producer && (
                    <div className="text-sm text-muted-foreground">
                      Producer: {beat.producer}
                    </div>
                  )}
                  {beat.license && (
                    <div className="text-sm text-muted-foreground">
                      License: {beat.license}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayBeat(beat);
                      }}
                      variant={currentBeat?.id === beat.id ? "secondary" : "outline"}
                      className="flex-1"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {currentBeat?.id === beat.id ? "Playing" : "Play"}
                    </Button>
                    {beat.audioUrl && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(beat.audioUrl, '_blank');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBeats.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No beats found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search term
              </p>
            </CardContent>
          </Card>
        )}

        {/* Beat Info */}
        <Card>
          <CardHeader>
            <CardTitle>About Our Beat Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Classic Styles</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>Boom Bap:</strong> Classic 90s hip-hop sound</li>
                  <li>• <strong>Old School:</strong> 80s hip-hop foundation</li>
                  <li>• <strong>Jazz Hop:</strong> Jazz-influenced beats</li>
                  <li>• <strong>Lo-Fi:</strong> Chill, relaxed vibes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Modern Styles</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>Trap:</strong> Heavy 808s and hi-hats</li>
                  <li>• <strong>Drill:</strong> Dark, aggressive sound</li>
                  <li>• <strong>Cloud Rap:</strong> Ethereal, atmospheric</li>
                  <li>• <strong>Experimental:</strong> Unique patterns</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Beat Sources & Licensing</h4>
              <p className="text-sm text-muted-foreground">
                All beats in our library are sourced from royalty-free collections and are suitable 
                for use in your rap battles. These beats come from various producers and platforms 
                that offer free-to-use instrumental hip-hop tracks.
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Pro Tip:</strong> Click on any beat card to preview it in the player above. 
                Use the "New Beat" button in the player to quickly cycle through different beats 
                in your current filter selection.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}