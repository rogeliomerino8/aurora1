'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VideoPlayerProps {
  videoUrl?: string;
  cameraLocation?: string;
  timestamp?: string;
}

export function VideoPlayer({ videoUrl, cameraLocation, timestamp }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate video progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  const handleRestart = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  if (!videoUrl) {
    return (
      <Card>
        <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
          No hay video disponible para este incidente
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Evidencia en Video</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Video placeholder */}
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-lg font-medium">Vista de Cámara</p>
              <p className="text-sm text-white/70">{cameraLocation}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={togglePlay}>
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            {timestamp && new Date(timestamp).toLocaleString('es-MX')}
          </div>

          <Button variant="ghost" size="icon">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
