"use client"

import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../table/data-table";
import { Button } from "~/app/_components/ui/button"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Badge } from "../badge";

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
        cell: ({ row }) => {
            const quote = row.original

            return (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => onDelete(quote.id)}
                        aria-label="Delete quote"
                    >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                    <Button
                        size="icon"
                        onClick={() => onEdit(quote.id)}
                        aria-label="Practice quote"
                    >
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            )
        },
    },
];

export function TableThemes({ themes, isPending, ...passthrough }: { themes: ThemeColumn[], isPending: boolean } & PassThroughProps) {
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
        />
    )
}
