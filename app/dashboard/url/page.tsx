"use client"

import { FormEvent, useMemo, useState } from "react"
import { IconLink, IconSearch } from "@tabler/icons-react"

import {
  DataPreview,
  type DataPreviewDataset,
} from "@/components/data-preview"
import type { EditableDataset } from "@/components/editable-data-grid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type SearchMode = "basic" | "deep"

export default function UrlPage() {
  const [url, setUrl] = useState("")
  const [includeHeaders, setIncludeHeaders] = useState(true)
  const [searchMode, setSearchMode] = useState<SearchMode>("basic")
  const [dataset, setDataset] = useState<DataPreviewDataset | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isValidUrl = useMemo(() => {
    try {
      if (!url.trim()) return false
      new URL(url)
      return true
    } catch {
      return false
    }
  }, [url])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValidUrl) return

    setIsLoading(true)

    // TODO: Implement real Tavily API integration
    // No mock data - waiting for real implementation

    setIsLoading(false)
  }

  const summary = useMemo(() => {
    if (!dataset) return null

    return {
      columns: dataset.columns.length,
      rows: dataset.rows.length,
    }
  }, [dataset])

  const handleDatasetChange = (updatedDataset: EditableDataset) => {
    setDataset({
      columns: updatedDataset.columns,
      rows: updatedDataset.rows,
    })
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <Card>
        <CardHeader className="gap-2">
          <CardTitle>URL</CardTitle>
          <CardDescription>
            Extract structured data from any web page. Bridgit AI scrapes the
            content and outputs clean tabular data.
          </CardDescription>
          {summary ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{summary.columns} columns</span>
              <span>{summary.rows} rows</span>
            </div>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="url">Web Page URL</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <IconLink className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/data"
                    className="pl-9"
                  />
                </div>
                <Button
                  type="submit"
                  className="sm:w-auto"
                  disabled={!isValidUrl || isLoading}
                >
                  <IconSearch className="mr-2 h-4 w-4" />
                  Extract Data
                </Button>
              </div>
              {url && !isValidUrl ? (
                <p className="text-sm text-destructive">
                  Please enter a valid URL starting with http:// or https://
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Include Headers Checkbox */}
              <div className="flex items-center gap-2 rounded-lg border border-dashed p-4">
                <Checkbox
                  id="include-headers"
                  checked={includeHeaders}
                  onCheckedChange={(checked) =>
                    setIncludeHeaders(checked === true)
                  }
                />
                <Label
                  htmlFor="include-headers"
                  className="cursor-pointer text-sm font-normal"
                >
                  Include table headers from page
                </Label>
              </div>

              {/* Search Mode Toggle */}
              <div className="flex flex-col gap-2 rounded-lg border border-dashed p-4">
                <Label className="text-sm font-medium">Search Mode</Label>
                <ToggleGroup
                  type="single"
                  value={searchMode}
                  onValueChange={(value: SearchMode) => {
                    if (value) setSearchMode(value)
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem value="basic" aria-label="Basic search">
                    Basic
                  </ToggleGroupItem>
                  <ToggleGroupItem value="deep" aria-label="Deep search">
                    <span className="flex items-center gap-1.5">
                      Deep
                      <Badge variant="default" className="text-[10px] px-1 py-0">
                        PRO
                      </Badge>
                    </span>
                  </ToggleGroupItem>
                </ToggleGroup>
                <p className="text-xs text-muted-foreground">
                  {searchMode === "basic"
                    ? "Quick extraction from visible content"
                    : "Advanced scraping with Tavily API (requires PRO)"}
                </p>
              </div>
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUrl("")
                setDataset(null)
              }}
              disabled={!url && !dataset}
            >
              Clear all
            </Button>
            {isLoading ? (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="size-3" /> Extracting data...
              </span>
            ) : null}
          </div>

          <DataPreview
            dataset={dataset}
            onDatasetChange={handleDatasetChange}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
