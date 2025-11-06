"use client"

import { useState, useEffect } from "react"
import { StationCard } from "@/components/station-card"
import { AudioPlayerProvider, useAudioPlayer } from "@/components/ui/audio-player"

const radioStations = [
  {
    id: "rock-radio",
    name: "Rock Radio",
    description: "Classic rock and modern rock hits",
    genre: "Rock",
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop",
    streamUrl: "https://strm112.1.fm/rock_now_mp3"
  },
  {
    id: "jazz-radio",
    name: "Jazz Lounge",
    description: "Smooth jazz and relaxing tunes",
    genre: "Jazz",
    imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&auto=format&fit=crop",
    streamUrl: "https://strm112.1.fm/jazz_now_mp3"
  },
  {
    id: "electronic-radio",
    name: "Electronic Beats",
    description: "EDM, house, and electronic music",
    genre: "Electronic",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop",
    streamUrl: "https://strm112.1.fm/edm_now_mp3"
  },
  {
    id: "classical-radio",
    name: "Classical Masterpieces",
    description: "Orchestral and classical music",
    genre: "Classical",
    imageUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&auto=format&fit=crop",
    streamUrl: "https://strm112.1.fm/classical_now_mp3"
  },
  {
    id: "hiphop-radio",
    name: "Hip Hop Station",
    description: "Rap, hip hop, and urban beats",
    genre: "Hip Hop",
    imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&auto=format&fit=crop",
    streamUrl: "https://strm112.1.fm/hiphop_now_mp3"
  },
  {
    id: "pop-radio",
    name: "Pop Hits",
    description: "Top 40 and popular music",
    genre: "Pop",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop",
    streamUrl: "https://strm112.1.fm/pop_now_mp3"
  },
  {
    id: "country-radio",
    name: "Country Roads",
    description: "Country music and southern rock",
    genre: "Country",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop",
    streamUrl: "https://strm112.1.fm/country_now_mp3"
  },
  {
    id: "news-radio",
    name: "News Radio",
    description: "Latest news and talk shows",
    genre: "News",
    imageUrl: "https://images.unsplash.com/photo-1476242906366-d8eb64c2f907?w=800&auto=format&fit=crop",
    streamUrl: "https://strm112.1.fm/news_now_mp3"
  }
];

function StationGridContent() {
  const player = useAudioPlayer()
  const [currentPlayingStation, setCurrentPlayingStation] = useState<string | null>(null)

  const handleStationPlay = (stationId: string, streamUrl: string) => {
    if (currentPlayingStation === stationId) {
      // If clicking the same station, toggle play/pause
      if (player.isPlaying) {
        player.pause()
        setCurrentPlayingStation(null)
      } else {
        player.play({
          id: stationId,
          src: streamUrl,
          data: { name: stationId }
        })
        setCurrentPlayingStation(stationId)
      }
    } else {
      // If clicking a different station, play it
      player.play({
        id: stationId,
        src: streamUrl,
        data: { name: stationId }
      })
      setCurrentPlayingStation(stationId)
    }
  }

  // Update current playing station based on dumb ass ai  state
  useEffect(() => {
    if (!player.isPlaying && currentPlayingStation) {
      setCurrentPlayingStation(null)
    }
  }, [player.isPlaying, currentPlayingStation])

  return (
    <div
      role="region"
      aria-label="Radio stations grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
    >
      {radioStations.map((station) => (
        <div key={station.id}>
          <StationCard
            title={station.name}
            subtitle={station.description}
            date={station.genre}
            imageUrl={station.imageUrl}
            onPlay={() => handleStationPlay(station.id, station.streamUrl)}
            isPlaying={currentPlayingStation === station.id && player.isPlaying}
          />
        </div>
      ))}
    </div>
  )
}

export default function GridList02() {
  return (
    <AudioPlayerProvider>
      <StationGridContent />
    </AudioPlayerProvider>
  )
}
