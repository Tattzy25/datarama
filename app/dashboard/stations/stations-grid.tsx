"use client"

import { useState } from "react"
import { IconSearch } from "@tabler/icons-react"

import { searchStations } from "@/app/actions/radio-browser"
import CardFlip from "@/components/kokonutui/card-flip"
import { Input } from "@/components/ui/input"

interface Station {
  id: string
  title: string
  subtitle: string
  description: string
  features: string[]
  stationuuid: string
  streamUrl: string
  favicon: string
}

interface StationsGridProps {
  initialStations: Station[]
}

export function StationsGrid({ initialStations }: StationsGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [stations, setStations] = useState<Station[]>(initialStations)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setStations(initialStations)
      return
    }

    setIsSearching(true)
    try {
      const results = await searchStations(query)
      setStations(results)
    } catch (error) {
      console.error('Search failed:', error)
      // Fallback to client-side filtering
      const filtered = initialStations.filter(
        (station) =>
          station.title.toLowerCase().includes(query.toLowerCase()) ||
          station.subtitle.toLowerCase().includes(query.toLowerCase())
      )
      setStations(filtered)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <>
      {/* Search Bar */}
      <div className="mx-auto w-full max-w-2xl">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search stations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        {isSearching && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Searching...
          </p>
        )}
        {!isSearching && searchQuery && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Found {stations.length} station{stations.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Stations Grid with Flip Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 place-items-center">
        {stations.map((station) => (
          <CardFlip
            key={station.id}
            title={station.title}
            subtitle={station.subtitle}
            description={station.description}
            features={station.features}
          />
        ))}
      </div>

      {stations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No stations found. Try a different search.
          </p>
        </div>
      )}
    </>
  )
}
