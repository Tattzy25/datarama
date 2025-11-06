"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconPlayerPlay } from "@tabler/icons-react"

interface StationCardProps {
  title: string
  subtitle?: string
  date?: string
  imageUrl: string
  onPlay?: () => void
  isPlaying?: boolean
}

export function StationCard({ title, subtitle, date, imageUrl, onPlay, isPlaying = false }: StationCardProps) {
  const handlePlayClick = () => {
    onPlay?.()
  }

  return (
    <Card className="relative w-full max-w-[400px] h-[120px] overflow-visible rounded-2xl shadow-[0px_14px_80px_rgba(34,35,58,0.2)] dark:shadow-[0px_14px_80px_rgba(0,0,0,0.5)] flex flex-row items-center p-[5px] bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
      {/* Card Media */}
      <div className="relative w-[110px] h-[110px] flex-shrink-0 rounded-2xl bg-white dark:bg-gray-900 overflow-hidden group">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        
        {/* Play/Pause Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="lg"
            variant="secondary"
            className={`rounded-full w-16 h-16 shadow-lg transition-all duration-300 ${
              isPlaying 
                ? 'bg-red-500/90 hover:bg-red-600 text-white' 
                : 'bg-white/90 hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900'
            }`}
            onClick={handlePlayClick}
          >
            {isPlaying ? (
              <div className="flex items-center justify-center w-8 h-8">
                <div className="w-2 h-6 bg-current rounded-sm mx-0.5" />
                <div className="w-2 h-6 bg-current rounded-sm mx-0.5" />
              </div>
            ) : (
              <IconPlayerPlay className="w-8 h-8" />
            )}
          </Button>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-3 flex-1 flex flex-col justify-center min-w-0">
        <h3 className="text-base font-bold mb-1 font-sans line-clamp-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
            {subtitle}
          </p>
        )}
        {date && (
          <p className="text-xs text-muted-foreground mb-2">
            {date}
          </p>
        )}
        <Button 
          size="sm"
          className="rounded-full px-4 py-2 mt-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700 w-fit"
          onClick={handlePlayClick}
        >
          Play
        </Button>
      </CardContent>
    </Card>
  )
}
