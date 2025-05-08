"use client"

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type Row,
    type RowSelectionState,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../alert-dialog"
import { useMemo, useState } from "react"
import { Input } from "../input"
import { DataTablePagination } from "./table-pagination"
import { DataTableViewOptions } from "./table-col-toggle"
import { Search } from "lucide-react"
import { Checkbox } from "../checkbox"
import { Button } from "../button"

function TableContentFallback({ columnsN }: { columnsN: number }) {
    return (
        <TableBody>
            {[...Array<number>(5)].map((_, index) => (
                <TableRow key={index} className="animate-pulse">
                    {[...Array<number>(columnsN)].map((_, i) => (
                        <TableCell key={i}>
                            <div className="h-8 w-full max-w-sm rounded-lg bg-gray-300 dark:bg-gray-900" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    )
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    defaultVisibility?: VisibilityState
    defaultPagination?: PaginationState
    searchBox?: boolean
    isPending?: boolean
    onTableRowClick?: (row: Row<TData>) => void
    onRowsAction?: (selectedRows: TData[], action: string) => void
    rowActions?: {
        label: string
        action: string
        icon?: React.ReactNode
        variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
        confirmationTitle?: string
        confirmationDescription?: string
    }[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
    defaultVisibility,
    defaultPagination,
    searchBox,
    isPending,
    onTableRowClick,
    onRowsAction,
    rowActions
}: DataTableProps<TData, TValue>) {

    const [globalFilter, setGlobalFilter] = useState<string>("")
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(defaultVisibility ?? {
        id: false
    })
    const [pagination, setPagination] = useState<PaginationState>(defaultPagination ?? {
        pageSize: 5,
        pageIndex: 0
    })

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [currentAction, setCurrentAction] = useState<{
        action: string
        title: string
        description: string
    } | null>(null)

    // Add selection column if we have row actions
    const selectionColumn: ColumnDef<TData, TValue> = useMemo(() => ({
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }), [])

    const allColumns = useMemo(
        () => ((rowActions?.length ?? 0) > 0 ? [selectionColumn, ...columns] : columns),
        [columns, rowActions?.length, selectionColumn],
    )

    const table = useReactTable({
        data,
        columns: allColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        globalFilterFn: "includesString",
        onGlobalFilterChange: setGlobalFilter,
        state: {
            columnVisibility,
            sorting,
            pagination,
            globalFilter,
            rowSelection
        }
    })


    const selectedRows = useMemo(() => {
        return table.getFilteredSelectedRowModel().rows.map((row) => row.original)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table.getFilteredSelectedRowModel().rows])

    const handleAction = (action: string) => {
        const actionConfig = rowActions?.find((a) => a.action === action)
        if (actionConfig?.confirmationTitle) {
            setCurrentAction({
                action,
                title: actionConfig.confirmationTitle,
                description:
                    actionConfig.confirmationDescription ??
                    `Are you sure you want to ${action.toLowerCase()} the selected items?`,
            })
            setShowConfirmDialog(true)
        } else if (onRowsAction && selectedRows.length > 0) {
            onRowsAction(selectedRows, action)
            setRowSelection({})
        }
    }

    const confirmAction = () => {
        if (currentAction && onRowsAction && selectedRows.length > 0) {
            onRowsAction(selectedRows, currentAction.action)
            setRowSelection({})
            setShowConfirmDialog(false)
            setCurrentAction(null)
        }
    }

    return (
        <>
            <div className="flex w-full mb-4 gap-4">
                {searchBox && (
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={`Search...`}
                            value={globalFilter}
                            onChange={(event) =>
                                table.setGlobalFilter(String(event.target.value))
                            }
                            className="max-w-sm pl-8 w-full"
                        />
                    </div>
                )}

                <div className="grow flex gap-4 justify-end">
                    {selectedRows.length > 0 && rowActions && rowActions.length > 0 && (
                        <div className="flex items-center gap-2 justify-center">
                            {rowActions?.map((action) => (
                                <Button
                                    key={action.action}
                                    variant={action.variant ?? "default"}
                                    onClick={() => handleAction(action.action)}
                                    className="flex items-center gap-1"
                                >
                                    {action.icon}
                                    {action.label} ({selectedRows.length})
                                </Button>
                            ))}
                        </div>
                    )}
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            <div className="rounded-md border w-full z-0">
                <Table>
                    <TableHeader >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="px-4" >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="px-6">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    {isPending ? <TableContentFallback columnsN={table.getHeaderGroups().reduce((acc, hg) => acc += hg.headers.length, 0)} /> : (
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        onClick={() => onTableRowClick && onTableRowClick(row)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="px-6">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    )}
                </Table>
            </div>
            <div className="mt-4">
                <DataTablePagination table={table} />
            </div>
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{currentAction?.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {currentAction?.description.replace("{count}", selectedRows.length.toString())}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCurrentAction(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmAction}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

