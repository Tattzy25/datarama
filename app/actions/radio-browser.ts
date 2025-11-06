'use server'

import dns from 'dns/promises'

// Fallback servers if DNS lookup fails
const FALLBACK_SERVERS = [
  'https://fi1.api.radio-browser.info',
  'https://de2.api.radio-browser.info',
  'https://de1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
]

// Default genres to fetch
const DEFAULT_GENRES = [
  'hip hop',
  'edm',
  'techno',
  'reggaeton',
  'r&b',
  'rap',
  'electronic',
]

interface RadioStation {
  stationuuid: string
  name: string
  url: string
  url_resolved: string
  homepage: string
  favicon: string
  tags: string
  countrycode: string
  state: string
  language: string
  languagecodes: string
  votes: number
  codec: string
  bitrate: number
  hls: number
  lastcheckok: number
  lastchecktime: string
  lastchecktime_iso8601: string
  clicktimestamp: string
  clicktimestamp_iso8601: string
  clickcount: number
  clicktrend: number
  ssl_error: number
  geo_lat: number | null
  geo_long: number | null
  has_extended_info: boolean
}

interface TransformedStation {
  id: string
  title: string
  subtitle: string
  description: string
  features: string[]
  stationuuid: string
  streamUrl: string
  favicon: string
}

/**
 * Get all Radio Browser server URLs via DNS lookup
 * Falls back to hardcoded servers if DNS fails
 */
async function getRadioBrowserServers(): Promise<string[]> {
  try {
    const records = await dns.resolveSrv('_api._tcp.radio-browser.info')
    const servers = records
      .sort((a, b) => a.priority - b.priority)
      .map((record) => `https://${record.name}`)

    // Shuffle for load balancing
    return servers.sort(() => Math.random() - 0.5)
  } catch (error) {
    console.error('DNS lookup failed, using fallback servers:', error)
    // Shuffle fallback servers
    return [...FALLBACK_SERVERS].sort(() => Math.random() - 0.5)
  }
}

/**
 * Download data from Radio Browser API with retry logic
 */
async function downloadFromRadioBrowser<T>(
  path: string,
  servers?: string[]
): Promise<T> {
  const serverList = servers || (await getRadioBrowserServers())

  for (let i = 0; i < serverList.length; i++) {
    const server = serverList[i]
    const url = `${server}${path}`

    try {
      console.log(`Trying server ${i + 1}/${serverList.length}: ${server}`)

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Bridgit AI/1.0',
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      console.error(`Failed to download from ${url}:`, error)
      if (i === serverList.length - 1) {
        throw new Error('All Radio Browser servers failed')
      }
      // Continue to next server
    }
  }

  throw new Error('No servers available')
}

/**
 * Fetch radio stations by genre tags
 */
export async function getStationsByGenres(
  genres: string[] = DEFAULT_GENRES,
  limit: number = 20
): Promise<TransformedStation[]> {
  try {
    // Get server list once for all requests
    const servers = await getRadioBrowserServers()

    // Fetch stations for each genre in parallel
    const genrePromises = genres.map(async (genre) => {
      const path = `/json/stations/search?tag=${encodeURIComponent(genre)}&hidebroken=true&limit=${limit}&order=clickcount&reverse=true`
      return downloadFromRadioBrowser<RadioStation[]>(path, servers)
    })

    const results = await Promise.all(genrePromises)

    // Flatten results and deduplicate by stationuuid
    const allStations = results.flat()
    const uniqueStations = new Map<string, RadioStation>()

    for (const station of allStations) {
      // Filter out broken stations
      if (station.lastcheckok !== 1) continue

      // Keep station with highest clickcount if duplicate
      const existing = uniqueStations.get(station.stationuuid)
      if (!existing || station.clickcount > existing.clickcount) {
        uniqueStations.set(station.stationuuid, station)
      }
    }

    // Transform to CardFlip format
    const transformed: TransformedStation[] = Array.from(
      uniqueStations.values()
    ).map((station) => ({
      id: station.stationuuid,
      title: station.name,
      subtitle: station.tags.split(',').slice(0, 3).join(', ') || 'Radio',
      description: station.homepage || `${station.countrycode} • ${station.language}`,
      features: [
        `${station.codec || 'Unknown'} ${station.bitrate ? station.bitrate + ' kbps' : ''}`.trim(),
        `${station.clickcount.toLocaleString()} clicks`,
        `${station.votes} votes`,
        station.countrycode || 'Unknown',
      ].filter(Boolean),
      stationuuid: station.stationuuid,
      streamUrl: station.url_resolved || station.url,
      favicon: station.favicon || '',
    }))

    // Sort by clickcount descending
    transformed.sort((a, b) => {
      const stationA = uniqueStations.get(a.stationuuid)!
      const stationB = uniqueStations.get(b.stationuuid)!
      return stationB.clickcount - stationA.clickcount
    })

    return transformed
  } catch (error) {
    console.error('Error fetching stations:', error)
    throw error
  }
}

/**
 * Track station click and get streaming URL
 */
export async function trackStationClick(
  stationuuid: string
): Promise<{ url: string; name: string; ok: boolean; message: string }> {
  try {
    const path = `/json/url/${stationuuid}`
    const result = await downloadFromRadioBrowser<{
      url: string
      name: string
      ok: boolean
      message: string
    }>(path)

    return result
  } catch (error) {
    console.error('Error tracking click:', error)
    throw error
  }
}

/**
 * Search stations by name
 */
export async function searchStations(
  query: string,
  limit: number = 50
): Promise<TransformedStation[]> {
  try {
    const path = `/json/stations/search?name=${encodeURIComponent(query)}&hidebroken=true&limit=${limit}&order=clickcount&reverse=true`
    const stations = await downloadFromRadioBrowser<RadioStation[]>(path)

    // Filter out broken stations and transform
    const transformed: TransformedStation[] = stations
      .filter((station) => station.lastcheckok === 1)
      .map((station) => ({
        id: station.stationuuid,
        title: station.name,
        subtitle: station.tags.split(',').slice(0, 3).join(', ') || 'Radio',
        description: station.homepage || `${station.countrycode} • ${station.language}`,
        features: [
          `${station.codec || 'Unknown'} ${station.bitrate ? station.bitrate + ' kbps' : ''}`.trim(),
          `${station.clickcount.toLocaleString()} clicks`,
          `${station.votes} votes`,
          station.countrycode || 'Unknown',
        ].filter(Boolean),
        stationuuid: station.stationuuid,
        streamUrl: station.url_resolved || station.url,
        favicon: station.favicon || '',
      }))

    return transformed
  } catch (error) {
    console.error('Error searching stations:', error)
    throw error
  }
}
