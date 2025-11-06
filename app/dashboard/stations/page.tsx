import { getStationsByGenres } from "@/app/actions/radio-browser"
import AiVoice from "@/components/kokonutui/ai-voice"
import { LiquidGlassCard } from "@/components/kokonutui/liquid-glass-card"
import ShimmerText from "@/components/kokonutui/shimmer-text"

import { StationsGrid } from "./stations-grid"

export default async function StationsPage() {
  // Fetch real radio stations from Radio Browser API
  const stations = await getStationsByGenres(
    ['hip hop', 'edm', 'techno', 'reggaeton', 'r&b', 'rap', 'electronic'],
    20 // top 20 per genre
  )

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 lg:px-6">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          <ShimmerText text="Hit Play. Watch Data Shake Its Assets." />
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          From raw numbers to rhythmic nonsense, courtesy of Bridgit AI
        </p>
      </div>

      {/* AI Voice & Glass Audio Player */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12">
        {/* AI Voice - Left */}
        <div className="flex justify-center lg:justify-end lg:flex-1">
          <div className="scale-125">
            <AiVoice />
          </div>
        </div>

        {/* Glass Audio Player - Right */}
        <div className="flex justify-center lg:justify-start lg:flex-1">
          <LiquidGlassCard className="w-full max-w-md">
            <div className="p-6">
              <h3 className="font-semibold mb-2">Audio Player</h3>
              <p className="text-sm text-muted-foreground">
                {stations.length} real radio stations loaded from Radio Browser
              </p>
            </div>
          </LiquidGlassCard>
        </div>
      </div>

      <StationsGrid initialStations={stations} />
    </div>
  )
}
