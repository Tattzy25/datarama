import { searchStationsAdvanced } from "@/app/actions/radio-browser"
import { StationsGrid } from "./stations-grid"
import ShimmerText from "@/components/kokonutui/shimmer-text"

export default async function StationsPage() {
  // Define preferred genres based on user input
  const genres = [
    'hip hop',
    'house',
    'edm',
    'electronic',
    'r&b',
    'rap',
    'rock',
    'top 100',
    'pop',
    'top 10',
    '2000s'
  ]

  // Fetch stations for each genre
  const genrePromises = genres.map((genre) =>
    searchStationsAdvanced({
      tag: genre,
      bitrateMin: 120,
      limit: 5,
      order: 'clickcount',
      reverse: true,
      hidebroken: true,
    })
  )

  const genreResults = await Promise.all(genrePromises)
  const allStations = genreResults.flat()

  // Shuffle and get 20 unique stations
  const uniqueStations = Array.from(
    new Map(allStations.map((s) => [s.stationuuid, s])).values()
  )
  const shuffled = uniqueStations.sort(() => Math.random() - 0.5)
  const stations = shuffled.slice(0, 20)

  return (
    <div className="flex flex-1 flex-col px-1 lg:px-1 pb-4 pt-0">
      {/* Header Section - Left aligned with shimmer */}
      <div className="flex flex-col gap-2 w-full mt-0 pt-0">
        <ShimmerText 
          text="Hit Play. Watch Data Shake Its Assets." 
          className="text-7xl sm:text-8xl md:text-9xl lg:text-[140px] xl:text-[160px] 2xl:text-[180px] font-bold tracking-tight leading-none text-left"
        />
      </div>

      {/* Subheadline - Center aligned, one row */}
      <div className="flex justify-center w-full mb-8">
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-center">
          From raw numbers to rhythmic nonsense, courtesy of Bridgit AI
        </p>
      </div>

      {/* 100px spacing */}
      <div className="h-[100px]" />

      {/* Stations Grid with Search - Center aligned */}
      <div className="flex flex-col items-center w-full">
        <StationsGrid initialStations={stations} />
      </div>
    </div>
  )
}
