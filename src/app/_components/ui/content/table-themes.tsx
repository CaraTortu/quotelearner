"use client"

import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../table/data-table";
import { Button } from "~/app/_components/ui/button"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "../badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../dropdown-menu"

export type ThemeColumn = {
    id: string;
    text: string;
    theme: string;
}

type PassThroughProps = { onDelete: (id: string) => void, onEdit: (id: string) => void }

const getColumns: (params: PassThroughProps) => ColumnDef<ThemeColumn>[] = ({ onEdit, onDelete }) => [
    {
        accessorKey: "theme",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Theme
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const theme = row.getValue<string>("theme")
            return <Badge variant="outline" className="ml-6">{theme}</Badge>
        },
    },
    {
        accessorKey: "text",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Quote
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const text = row.getValue<string>("text")
            return <div className="font-medium pl-2">{text}</div>
        },
    },
    {
        id: "actions",
        header: () => <div className="text-right whitespace-nowrap">Actions</div>,
        cell: ({ row }) => {
            const quote = row.original

            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="flex flex-col gap-2">
                                <Button
                                    className="flex cursor-pointer w-full gap-2"
                                    onClick={() => onEdit(quote.id)}
                                >
                                    <Pencil className="h-4 w-4" />
                                    <span>Edit</span>
                                </Button>
                                <Button
                                    onClick={() => onDelete(quote.id)}
                                    className="flex cursor-pointer gap-2"
                                    variant="destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete</span>
                                </Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        size: 50, // Reduced width for actions column since we're using a dropdown
    },
];

export function TableThemes({ themes, isPending, onDeleteAll, ...passthrough }: { themes: ThemeColumn[], isPending: boolean, onDeleteAll: (rows: ThemeColumn[]) => void } & PassThroughProps) {
    const columns = useMemo(() => getColumns(passthrough), [passthrough])

    return (
        <DataTable
            columns={columns}
            data={themes}
            searchBox={true}
            isPending={isPending}
            defaultPagination={{
                pageIndex: 0,
                pageSize: 10,
            }}
            onRowsAction={(rows, action) => {
                switch (action) {
                    case "delete":
                        onDeleteAll(rows)
                }
            }}
            rowActions={[
                {
                    label: "Delete",
                    action: "delete",
                    icon: <Trash2 className="h-4 w-4" />,
                    variant: "destructive",
                    confirmationTitle: "Delete Selected Quotes",
                    confirmationDescription:
                        "Are you sure you want to delete {count} selected quote(s)? This action cannot be undone.",
                },
            ]}
        />
    )
}
