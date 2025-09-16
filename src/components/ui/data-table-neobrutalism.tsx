"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
}

export function DataTableNeobrutalism<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "FILTRAR..."
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full font-black text-main-foreground">
      {/* Filter Controls - Neobrutalism Style */}
      <div className="flex items-center py-4 gap-4">
        {searchKey && (
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-chart-6 brutal-border font-black placeholder:text-main-foreground/50 placeholder:uppercase"
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto bg-chart-8 text-main-foreground brutal-border font-black uppercase hover:brutal-hover">
              COLUMNAS <ChevronDown className="icon-standard ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-chart-2 brutal-border-thick brutal-shadow-xl"
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="text-main-foreground font-black uppercase hover:bg-chart-1"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table - Neobrutalism Style */}
      <div className="bg-chart-3 brutal-border-thick brutal-shadow-xl rounded-base overflow-hidden">
        <Table>
          <TableHeader className="font-black">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="bg-chart-1 text-main-foreground border-b-4 border-chart-4 hover:bg-chart-1"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-main-foreground font-black uppercase" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="bg-chart-6 text-main-foreground border-b-2 border-chart-4 data-[state=selected]:bg-chart-8 data-[state=selected]:text-main-foreground hover:bg-chart-7 transition-all duration-200"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-4 py-3 font-bold" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center bg-chart-4 text-main-foreground font-black uppercase"
                >
                  NO HAY RESULTADOS.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Neobrutalism Style */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-main-foreground flex-1 text-sm font-bold uppercase">
          {table.getFilteredSelectedRowModel().rows.length} DE{" "}
          {table.getFilteredRowModel().rows.length} FILA(S) SELECCIONADA(S).
        </div>
        <div className="space-x-2">
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-chart-7 text-main-foreground brutal-border font-black uppercase hover:brutal-hover disabled:opacity-50"
          >
            ANTERIOR
          </Button>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-chart-7 text-main-foreground brutal-border font-black uppercase hover:brutal-hover disabled:opacity-50"
          >
            SIGUIENTE
          </Button>
        </div>
      </div>
    </div>
  )
}

// Helper function to create neobrutalism column definitions
export const createNeobrutalistColumns = {
  // Standard text column
  text: (accessor: string, header: string) => ({
    accessorKey: accessor,
    header: ({ column }: any) => {
      return (
        <Button
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="bg-transparent hover:bg-chart-2 text-main-foreground font-black uppercase p-0 h-auto brutal-border-0"
        >
          {header.toUpperCase()}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }: any) => (
      <div className="font-black text-main-foreground uppercase">
        {row.getValue(accessor)?.toString().toUpperCase() || "-"}
      </div>
    ),
  }),

  // Status column with badges
  status: (accessor: string, header: string, statusMap?: Record<string, { label: string, color: string }>) => ({
    accessorKey: accessor,
    header: header.toUpperCase(),
    cell: ({ row }: any) => {
      const status = row.getValue(accessor) as string
      const statusConfig = statusMap?.[status] || { label: status, color: "chart-7" }

      return (
        <div className={`inline-flex px-3 py-1 rounded-base brutal-border font-black text-xs uppercase bg-${statusConfig.color} text-main-foreground`}>
          {statusConfig.label.toUpperCase()}
        </div>
      )
    },
  }),

  // Actions column
  actions: (onEdit?: (row: any) => void, onDelete?: (row: any) => void, onView?: (row: any) => void) => ({
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-chart-8 text-main-foreground brutal-border font-black h-8 w-8 p-0 hover:brutal-hover">
              <span className="sr-only">ABRIR MENÚ</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-chart-2 brutal-border-thick brutal-shadow-xl"
          >
            <DropdownMenuLabel className="text-main-foreground font-black uppercase">
              ACCIONES
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-chart-4" />
            {onView && (
              <DropdownMenuItem
                onClick={() => onView(row.original)}
                className="text-main-foreground font-bold uppercase hover:bg-chart-1"
              >
                VER DETALLES
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem
                onClick={() => onEdit(row.original)}
                className="text-main-foreground font-bold uppercase hover:bg-chart-1"
              >
                EDITAR
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(row.original)}
                className="text-main-foreground font-bold uppercase hover:bg-chart-2"
              >
                ELIMINAR
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }),

  // Checkbox selection column
  select: () => ({
    id: "select",
    header: ({ table }: any) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="SELECCIONAR TODOS"
        className="brutal-border"
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="SELECCIONAR FILA"
        className="brutal-border"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
}