"use client"

import { useState, useRef } from "react"
import { Station } from "./types/station"
import { StationSearchBar } from "./components/StationSearchBar"
import { StationList } from "./components/StationList"
import { LoadMoreButton } from "./components/LoadMoreButton"
import { useStationSearch } from "./hooks/useStationSearch"
import { useStationFilters } from "./hooks/useStationFilters"
import { useStationPagination } from "./hooks/useStationPagination"
import { Speaker } from "@/components/speaker"

interface StationsGridProps {
  initialStations: Station[]
}

export function StationsGrid({ initialStations }: StationsGridProps) {
  const [isSearching, setIsSearching] = useState(false)
  const [currentStation, setCurrentStation] = useState<Station | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const { searchQuery, stations, setStations, handleSearch } =
    useStationSearch(initialStations)

  // Keep internal filtering hook active (no visible filter UI)
  useStationFilters(setStations, setIsSearching)

  const { displayedStations, handleLoadMore, hasMore } =
    useStationPagination(stations)

  const handlePlayStation = async (station: Station) => {
    if (!audioRef.current) return
    
    // If clicking the same station that's already playing, toggle pause
    if (currentStation?.stationuuid === station.stationuuid && !audioRef.current.paused) {
      audioRef.current.pause()
      setCurrentStation(null)
      return
    }
    
    // Stop any current playback and reset
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    
    // Set new station
    setCurrentStation(station)
    
    // Wait a brief moment for the audio element to reset
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Load and play the new station with proper promise handling
    audioRef.current.src = station.streamUrl
    
    try {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        await playPromise
        // Playback started successfully
      }
    } catch (error) {
      console.error("Error playing station:", error)
      // Reset current station if playback fails
      setCurrentStation(null)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Hidden audio element for radio streaming */}
      <audio ref={audioRef} />

      <StationSearchBar
        searchQuery={searchQuery}
        isSearching={isSearching}
        onSearchChange={handleSearch}
        resultsCount={stations.length}
      />

      {/* Music Player - 100px spacing above, 80px spacing below */}
      <div className="mt-[100px] mb-[80px] flex justify-center">
        <div className="w-full max-w-2xl">
          <Speaker currentStation={currentStation} audioRef={audioRef} />
        </div>
      </div>

  <StationList stations={displayedStations} onPlay={handlePlayStation} />

      <LoadMoreButton hasMore={hasMore} onLoadMore={handleLoadMore} />
    </div>
  )
}
