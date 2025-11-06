# Radio Browser API Integration

## Overview
Integrated real radio station data from the Radio Browser API (https://radio-browser.info) to replace mock data in the Stations page.

## Implementation Details

### 1. Server Action (`app/actions/radio-browser.ts`)

Created a comprehensive server action module that handles:

#### Features:
- **DNS-based Server Discovery**: Automatic discovery of all Radio Browser servers via SRV DNS lookup of `_api._tcp.radio-browser.info`
- **Fallback Servers**: Hardcoded fallback array (fi1, de2, de1, nl1) if DNS fails
- **Load Balancing**: Random server selection for distributed load
- **Retry Logic**: Automatically tries next server if one fails
- **Quality Filtering**: 
  - Filters out broken stations (`lastcheckok === 1`)
  - Uses `hidebroken=true` parameter in API calls
  - Deduplicates stations by `stationuuid`
- **Modern API Fields**: Uses `stationuuid` (not deprecated `id`) and `countrycode` (not deprecated `country`)
- **User-Agent Header**: Sends "Bridgit AI/1.0" as required by API
- **Caching**: 1-hour revalidation cache for better performance

#### Functions:

**`getStationsByGenres(genres, limit)`**
- Fetches top radio stations for specified genres
- Default genres: hip hop, edm, techno, reggaeton, r&b, rap, electronic
- Returns top 20 stations per genre (configurable)
- Sorts by click count (most popular first)
- Deduplicates across genres
- Transforms API response to CardFlip component format

**`trackStationClick(stationuuid)`**
- Increments station click counter via `/json/url/{stationuuid}` endpoint
- Returns stream URL for playback
- Ready for play button integration

**`searchStations(query, limit)`**
- Searches stations by name
- Filters broken stations
- Returns up to 50 results

### 2. Stations Page (`app/dashboard/stations/page.tsx`)

Converted to React Server Component that:
- Fetches real station data on server
- Passes initial data to client component
- Shows station count in audio player status
- Improved from 6 mock stations to 100+ real stations

### 3. Stations Grid (`app/dashboard/stations/stations-grid.tsx`)

Client component that handles:
- Search functionality (debounced)
- Server-side search via Radio Browser API
- Client-side filtering fallback
- Shows search results count
- Responsive grid layout with CardFlip components

### 4. Data Transformation

Radio Browser API stations are transformed to match CardFlip interface:

```typescript
{
  id: stationuuid,           // Unique UUID
  title: name,               // Station name
  subtitle: tags,            // First 3 genre tags
  description: homepage,     // Station website or country/language
  features: [
    "MP3 128 kbps",          // Codec + bitrate
    "1,234 clicks",          // Click count
    "89 votes",              // Vote count
    "US"                     // Country code
  ]
}
```

## API Endpoints Used

- **Server Discovery**: DNS SRV lookup of `_api._tcp.radio-browser.info`
- **Station Search**: `/json/stations/search?tag={genre}&hidebroken=true&limit=20&order=clickcount&reverse=true`
- **Click Tracking**: `/json/url/{stationuuid}`
- **Name Search**: `/json/stations/search?name={query}&hidebroken=true&limit=50`

## Quality Filtering

Implements all user requirements:
1. ✅ Uses `stationuuid` instead of deprecated `id`
2. ✅ Uses `countrycode` instead of deprecated `country`
3. ✅ Server fallback between fi1, de2, de1, nl1
4. ✅ Filters out broken stations (`lastcheckok === 1`, `hidebroken=true`)
5. ✅ Deduplicates by `stationuuid`
6. ✅ Fetches top stations for 7 genres
7. ✅ Sends User-Agent header

## Genres Loaded

Default genres (top 20 each):
- Hip Hop
- EDM
- Techno
- Reggaeton
- R&B
- Rap
- Electronic

## Next Steps

### Immediate Enhancements:
1. **Play Button Integration**: Add play functionality to flip cards using `trackStationClick()`
2. **Audio Player Integration**: Connect stream URLs to the LiquidGlassCard audio player
3. **Station Logos**: Display `favicon` field in flip cards
4. **Loading States**: Add Suspense boundaries for better UX
5. **Error Handling**: Show user-friendly error messages if API fails

### Future Enhancements:
1. **Genre Tabs**: Filter by genre in UI
2. **Favorites**: Save favorite stations to localStorage
3. **Recent Plays**: Track listening history
4. **Station Details**: Modal with full station info
5. **Streaming Analytics**: Track popular stations
6. **Country Filter**: Filter by country code
7. **Language Filter**: Filter by language
8. **Codec Filter**: Filter by audio codec (MP3, AAC, etc.)

## Radio Browser API Stats

- **51,397+** radio stations
- **10,750** genre tags
- **238** countries
- **601** languages
- **Public Domain** data license
- **Free** API (no authentication required)
- **Community-driven** (like Wikipedia)

## Testing

Server is running at: http://localhost:3001/dashboard/stations

Expected behavior:
- Grid displays 100+ real radio stations (deduplicated)
- Stations show real names, genres, bitrates, click counts
- Search bar filters stations by name
- Each flip card shows station details on back

## Documentation

- API Docs: https://api.radio-browser.info
- Community Site: https://www.radio-browser.info
- DNS Examples: https://api.radio-browser.info/examples/
