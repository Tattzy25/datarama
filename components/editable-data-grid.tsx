"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { IconPlus, IconTrash } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type DataRow = Record<string, string>

export type EditableDataset = {
  columns: string[]
  rows: DataRow[]
}

type EditableDataGridProps = {
  dataset: EditableDataset | null
  onChange?: (dataset: EditableDataset) => void
  className?: string
}

export function EditableDataGrid({ dataset, onChange, className }: EditableDataGridProps) {
  const [data, setData] = useState<DataRow[]>(() => dataset?.rows || [])
  const [columnNames, setColumnNames] = useState<string[]>(() => dataset?.columns || [])

  // Sync internal state with prop changes when dataset changes
  useEffect(() => {
    if (dataset) {
      setData(dataset.rows)
      setColumnNames(dataset.columns)
    }
  }, [dataset])

  const handleCellChange = useCallback((rowIndex: number, columnId: string, value: string) => {
    const newData = [...data]
    newData[rowIndex] = { ...newData[rowIndex], [columnId]: value }
    setData(newData)
    onChange?.({ columns: columnNames, rows: newData })
  }, [data, columnNames, onChange])

  const handleAddRow = useCallback(() => {
    const newRow = columnNames.reduce<DataRow>((acc, col) => {
      acc[col] = ""
      return acc
    }, {})
    const newData = [...data, newRow]
    setData(newData)
    onChange?.({ columns: columnNames, rows: newData })
  }, [data, columnNames, onChange])

  const handleRemoveRow = useCallback((index: number) => {
    const newData = data.filter((_, i) => i !== index)
    setData(newData)
    onChange?.({ columns: columnNames, rows: newData })
  }, [data, columnNames, onChange])

  const handleAddColumn = useCallback(() => {
    const newColumnName = `Column ${columnNames.length + 1}`
    const newColumns = [...columnNames, newColumnName]
    const newData = data.map((row) => ({ ...row, [newColumnName]: "" }))
    
    setColumnNames(newColumns)
    setData(newData)
    onChange?.({ columns: newColumns, rows: newData })
  }, [data, columnNames, onChange])

  const handleRemoveColumn = useCallback((columnId: string) => {
    if (columnNames.length <= 1) return

    const newColumns = columnNames.filter((col) => col !== columnId)
    const newData = data.map((row) => {
      const newRow = { ...row }
      delete newRow[columnId]
      return newRow
    })

    setColumnNames(newColumns)
    setData(newData)
    onChange?.({ columns: newColumns, rows: newData })
  }, [data, columnNames, onChange])

  const handleRenameColumn = useCallback((oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName) return

    const newColumns = columnNames.map((col) => (col === oldName ? newName : col))
    const newData = data.map((row) => {
      const newRow = { ...row }
      if (oldName in newRow) {
        newRow[newName] = newRow[oldName]
        delete newRow[oldName]
      }
      return newRow
    })

    setColumnNames(newColumns)
    setData(newData)
    onChange?.({ columns: newColumns, rows: newData })
  }, [data, columnNames, onChange])

  // Build dynamic columns for TanStack Table
  const columns = useMemo<ColumnDef<DataRow>[]>(() => {
    return columnNames.map((columnName) => ({
      accessorKey: columnName,
      id: columnName,
      header: () => (
        <div className="flex items-center gap-2">
          <Input
            value={columnName}
            onChange={(e) => handleRenameColumn(columnName, e.target.value)}
            className="h-8 font-medium"
            onFocus={(e) => e.target.select()}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => handleRemoveColumn(columnName)}
            disabled={columnNames.length <= 1}
          >
            <IconTrash className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
      cell: ({ row, column }) => (
        <Input
          value={(row.original[column.id as string] as string) || ""}
          onChange={(e) => handleCellChange(row.index, column.id, e.target.value)}
          className="h-10 rounded-none border-0 focus-visible:ring-1"
          placeholder="Enter value..."
        />
      ),
    }))
  }, [columnNames, handleCellChange, handleRemoveColumn, handleRenameColumn])

  // Add actions column
  const allColumns = useMemo<ColumnDef<DataRow>[]>(() => {
    return [
      ...columns,
      {
        id: "actions",
        header: () => (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-full"
            onClick={handleAddColumn}
          >
            <IconPlus className="h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleRemoveRow(row.index)}
            >
              <IconTrash className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
        size: 100,
      },
    ]
  }, [columns, handleAddColumn, handleRemoveRow])

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (!dataset || dataset.columns.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
        No data to display. Generate some data to get started.
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="min-w-[150px]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-0">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={allColumns.length}
                    className="h-24 text-center"
                  >
                    No rows. Click &quot;Add Row&quot; to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="mt-4 flex justify-start">
        <Button variant="outline" onClick={handleAddRow}>
          <IconPlus className="mr-2 h-4 w-4" />
          Add Row
        </Button>
      </div>
    </div>
  )
}
