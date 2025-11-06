'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Volume2, VolumeX, Pause, Play, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * SimpleSpeaker - A lightweight audio player component for radio stations
 *
 * Features:
 * - Play/pause controls with loading states
 * - Volume control with mute toggle
 * - Station information display
 * - Error handling and user feedback
 * - Keyboard accessibility
 *
 * @param currentStation - Current radio station to play
 * @param className - Optional CSS class name for styling
 */
interface SimpleSpeakerProps {
  currentStation?: {
    title: string
    streamUrl: string
  } | null
  className?: string
}

export function SimpleSpeaker({ currentStation, className }: SimpleSpeakerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canPlay, setCanPlay] = useState(false)

  // Handle station changes with improved error handling
  useEffect(() => {
    if (currentStation?.streamUrl && audioRef.current) {
      setIsLoading(true)
      setError(null)
      setCanPlay(false)

      // Stop current playback
      audioRef.current.pause()
      audioRef.current.currentTime = 0

      // Set new source
      audioRef.current.src = currentStation.streamUrl
      audioRef.current.load()
    } else if (!currentStation && audioRef.current) {
      // No station selected - stop playback
      audioRef.current.pause()
      setIsPlaying(false)
      setIsLoading(false)
      setCanPlay(false)
      setError(null)
    }
  }, [currentStation])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleCanPlay = () => {
      setCanPlay(true)
      setError(null)
    }

    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement
      const errorMessage = target.error?.message || 'Failed to load audio'
      setError(errorMessage)
      setIsLoading(false)
      setIsPlaying(false)
      setCanPlay(false)
    }

    const handleLoadStart = () => {
      setIsLoading(true)
      setError(null)
    }

    const handleLoadedData = () => {
      setIsLoading(false)
    }

    const handlePlay = () => {
      setIsPlaying(true)
      setIsLoading(false)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('loadeddata', handleLoadedData)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('loadeddata', handleLoadedData)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlayPause = useCallback(async () => {
    if (!audioRef.current || !canPlay) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      try {
        setIsLoading(true)
        await audioRef.current.play()
      } catch (error) {
        console.error('Play failed:', error)
        setError('Failed to play audio')
        setIsLoading(false)
      }
    }
  }, [isPlaying, canPlay])

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }, [])

  const toggleMute = useCallback(() => {
    const newVolume = volume > 0 ? 0 : 0.7
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }, [volume])

  const getVolumeIcon = useCallback(() => {
    if (volume === 0) return VolumeX
    return Volume2
  }, [volume])

  const VolumeIcon = getVolumeIcon()

  // Sync volume changes to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  return (
    <div
      className={cn('flex items-center gap-4 p-4 bg-muted rounded-lg', className)}
      role="region"
      aria-label="Audio player controls"
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        preload="none"
        crossOrigin="anonymous"
        aria-hidden="true"
      />

      {/* Play/Pause Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={togglePlayPause}
        disabled={isLoading || !currentStation || !canPlay}
        className="h-12 w-12 rounded-full"
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>

      {/* Station Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {currentStation?.title || 'No station selected'}
        </p>
        <p className="text-xs text-muted-foreground">
          {error ? (
            <span className="text-destructive">{error}</span>
          ) : isLoading ? (
            'Loading...'
          ) : isPlaying ? (
            'Playing'
          ) : canPlay ? (
            'Paused'
          ) : currentStation ? (
            'Ready to play'
          ) : (
            'Select a station'
          )}
        </p>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2" role="group" aria-label="Volume controls">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="h-8 w-8"
          aria-label={volume === 0 ? 'Unmute audio' : 'Mute audio'}
        >
          <VolumeIcon className="h-4 w-4" />
        </Button>

        <div className="w-20">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            aria-label="Volume level"
          />
        </div>

        <span className="text-xs text-muted-foreground w-8" aria-live="polite">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  )
}
