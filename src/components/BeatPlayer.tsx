import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Volume2, Download, ExternalLink } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Beat, getBeatEmoji } from '@/lib/beats';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface BeatPlayerProps {
  beat: Beat;
  onGenerateNew?: () => void;
}

export function BeatPlayer({ beat, onGenerateNew }: BeatPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentNoteRef = useRef(0);

  useEffect(() => {
    // Create audio element if beat has URL
    if (beat.audioUrl) {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.loop = true;
      audio.volume = volume;
      
      audio.addEventListener('loadstart', () => setIsLoading(true));
      audio.addEventListener('canplay', () => {
        setIsLoading(false);
        setError(null);
      });
      audio.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
        setError('Failed to load beat. Using synthesized version.');
        setIsLoading(false);
      });
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.src = beat.audioUrl;
      audioRef.current = audio;
      
      return () => {
        audio.pause();
        audio.src = '';
        audioRef.current = null;
      };
    }
  }, [beat.audioUrl, volume]);

  useEffect(() => {
    // Update volume
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopBeat();
    };
  }, []);

  useEffect(() => {
    // Reset when beat changes
    stopBeat();
    setCurrentTime(0);
    setError(null);
  }, [beat.id]);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playSound = (frequency: number, time: number, duration: number = 0.1) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume * 0.3;
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

    oscillator.start(time);
    oscillator.stop(time + duration);
  };

  const scheduleNote = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const secondsPerBeat = 60.0 / beat.bpm / 4; // 16th notes
    const pattern = beat.pattern.split('-');

    while (nextNoteTimeRef.current < audioContext.currentTime + 0.1) {
      const currentSound = pattern[currentNoteRef.current % pattern.length];

      switch (currentSound) {
        case 'kick':
          playSound(60, nextNoteTimeRef.current, 0.15);
          break;
        case 'snare':
          playSound(200, nextNoteTimeRef.current, 0.1);
          break;
        case 'hat':
          playSound(800, nextNoteTimeRef.current, 0.05);
          break;
      }

      nextNoteTimeRef.current += secondsPerBeat;
      currentNoteRef.current++;
    }
  };

  const startSynthesizedBeat = () => {
    const audioContext = initAudioContext();
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    nextNoteTimeRef.current = audioContext.currentTime;
    currentNoteRef.current = 0;

    intervalRef.current = setInterval(() => {
      scheduleNote();
      setCurrentTime(prev => prev + 0.025);
    }, 25);
  };

  const startBeat = async () => {
    if (beat.audioUrl && audioRef.current && !error) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Playback error:', err);
        setError('Playback failed. Using synthesized version.');
        startSynthesizedBeat();
        setIsPlaying(true);
      }
    } else {
      // Use synthesized beat as fallback
      startSynthesizedBeat();
      setIsPlaying(true);
    }
  };

  const stopBeat = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopBeat();
    } else {
      startBeat();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="text-2xl">{getBeatEmoji(beat.style)}</span>
            {beat.name}
          </span>
          <div className="flex items-center gap-2">
            {beat.producer && (
              <Badge variant="secondary" className="text-xs">
                by {beat.producer}
              </Badge>
            )}
            {onGenerateNew && (
              <Button
                variant="outline"
                size="sm"
                onClick={onGenerateNew}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                New Beat
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            onClick={togglePlayback}
            disabled={isLoading}
            className="flex-shrink-0"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading...
              </>
            ) : isPlaying ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Play
              </>
            )}
          </Button>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={1}
                step={0.1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-10">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>

        {beat.audioUrl && duration > 0 && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Style:</span> {beat.style}
          </div>
          <div>
            <span className="text-muted-foreground">BPM:</span> {beat.bpm}
          </div>
          {beat.license && (
            <div className="col-span-2">
              <span className="text-muted-foreground">License:</span> {beat.license}
            </div>
          )}
          {!beat.audioUrl && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Pattern:</span> {beat.pattern}
            </div>
          )}
        </div>

        {error && (
          <div className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
            {error}
          </div>
        )}

        {isPlaying && (
          <div className="text-center text-sm text-muted-foreground animate-pulse">
            Beat is playing... Drop your bars! 🎤
          </div>
        )}

        {beat.audioUrl && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1"
            >
              <a href={beat.audioUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Open Original
              </a>
            </Button>
            {beat.producer && (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}