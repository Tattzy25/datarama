"use client"

import { FormEvent, useMemo, useState } from "react"
import { IconPlus, IconTrash } from "@tabler/icons-react"

import {
  DataPreview,
  type DataPreviewDataset,
  type DataRow,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

export default function MatrixPage() {
  const [rowHeaders, setRowHeaders] = useState<string[]>(["Feature A", "Feature B"])
  const [columnHeaders, setColumnHeaders] = useState<string[]>(["Option 1", "Option 2"])
  const [newRowHeader, setNewRowHeader] = useState("")
  const [newColumnHeader, setNewColumnHeader] = useState("")
  const [dataset, setDataset] = useState<DataPreviewDataset | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const hasHeaders = rowHeaders.length > 0 && columnHeaders.length > 0

  const handleAddRowHeader = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = newRowHeader.trim()
    if (!value || rowHeaders.includes(value)) return

    setRowHeaders((prev) => [...prev, value])
    setNewRowHeader("")
  }

  const handleRemoveRowHeader = (value: string) => {
    setRowHeaders((prev) => prev.filter((header) => header !== value))
  }

  const handleAddColumnHeader = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = newColumnHeader.trim()
    if (!value || columnHeaders.includes(value)) return

    setColumnHeaders((prev) => [...prev, value])
    setNewColumnHeader("")
  }

  const handleRemoveColumnHeader = (value: string) => {
    setColumnHeaders((prev) => prev.filter((header) => header !== value))
  }

  const handleGenerate = async () => {
    if (!hasHeaders) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // TODO: Connect to backend API here
    // Placeholder: Create matrix with row headers as rows, column headers as columns
    const matrixRows = rowHeaders.map((rowHeader) => {
      const row: DataRow = { "Row Header": rowHeader }
      columnHeaders.forEach((colHeader) => {
        row[colHeader] = ""
      })
      return row
    })

    setDataset({
      columns: ["Row Header", ...columnHeaders],
      rows: matrixRows,
    })
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
          <CardTitle>Matrix</CardTitle>
          <CardDescription>
            Define row and column headers to create a comparison matrix. Bridgit
            AI fills the intersections automatically.
          </CardDescription>
          {summary ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{summary.columns} columns</span>
              <span>{summary.rows} rows</span>
            </div>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Row Headers */}
            <form
              onSubmit={handleAddRowHeader}
              className="flex flex-col gap-3 rounded-lg border border-dashed p-4"
            >
              <div className="flex flex-col gap-1">
                <Label htmlFor="row-header">Row Headers (Vertical)</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    id="row-header"
                    value={newRowHeader}
                    onChange={(e) => setNewRowHeader(e.target.value)}
                    placeholder="e.g. Feature Name"
                  />
                  <Button
                    type="submit"
                    className="sm:w-auto"
                    disabled={!newRowHeader.trim()}
                  >
                    <IconPlus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Current row headers</Label>
                {rowHeaders.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {rowHeaders.map((header) => (
                      <Badge
                        key={header}
                        variant="secondary"
                        className="flex items-center gap-1.5"
                      >
                        {header}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveRowHeader(header)}
                          aria-label={`Remove ${header}`}
                        >
                          <IconTrash className="h-3.5 w-3.5" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No row headers added yet.
                  </p>
                )}
              </div>
            </form>

            {/* Column Headers */}
            <form
              onSubmit={handleAddColumnHeader}
              className="flex flex-col gap-3 rounded-lg border border-dashed p-4"
            >
              <div className="flex flex-col gap-1">
                <Label htmlFor="column-header">Column Headers (Horizontal)</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    id="column-header"
                    value={newColumnHeader}
                    onChange={(e) => setNewColumnHeader(e.target.value)}
                    placeholder="e.g. Plan Type"
                  />
                  <Button
                    type="submit"
                    className="sm:w-auto"
                    disabled={!newColumnHeader.trim()}
                  >
                    <IconPlus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Current column headers</Label>
                {columnHeaders.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {columnHeaders.map((header) => (
                      <Badge
                        key={header}
                        variant="secondary"
                        className="flex items-center gap-1.5"
                      >
                        {header}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveColumnHeader(header)}
                          aria-label={`Remove ${header}`}
                        >
                          <IconTrash className="h-3.5 w-3.5" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No column headers added yet.
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleGenerate} disabled={!hasHeaders || isLoading}>
              Generate Matrix with Bridgit AI
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDataset(null)}
              disabled={!dataset}
            >
              Clear matrix
            </Button>
            {isLoading ? (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="size-3" /> Generating...
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
