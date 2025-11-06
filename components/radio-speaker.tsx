'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface RadioSpeakerProps {
  currentStation?: {
    title: string
    streamUrl: string
  } | null
  className?: string
}

export function RadioSpeaker({ currentStation, className }: RadioSpeakerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = volume
      audioRef.current.preload = 'none'
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (currentStation?.streamUrl && audioRef.current) {
      // Set the stream URL but don't auto-play
      audioRef.current.src = currentStation.streamUrl
      audioRef.current.load()
      setIsPlaying(false)
    }
  }, [currentStation])

  const togglePlay = () => {
    if (!audioRef.current || !currentStation) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(error => {
        console.error('Playback failed:', error)
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume
    }
  }

  if (!currentStation) {
    return (
      <Card className={cn('p-4 text-center text-muted-foreground', className)}>
        Select a radio station to play
      </Card>
    )
  }

  return (
    <Card className={cn('p-4 space-y-4', className)}>
      {/* Station Info */}
      <div className="text-center">
        <h3 className="font-medium text-sm truncate">
          {currentStation.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {isPlaying ? 'Now Playing' : 'Paused'}
        </p>
      </div>

      {/* Play/Pause Control */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlay}
          className="h-12 w-12 rounded-full"
          disabled={!currentStation.streamUrl}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-xs text-muted-foreground w-8 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </Card>
  )
}
