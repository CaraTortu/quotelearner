"use client"

import { Trash2, Pencil, Search } from "lucide-react"
import { Button } from "~/app/_components/ui/button"
import { Badge } from "~/app/_components/ui/badge"
import { Card, CardContent } from "~/app/_components/ui/card"
import type { ThemeColumn } from "~/app/_components/ui/content/table-themes"
import { useEffect, useState } from "react"
import { Input } from "../input"

interface QuoteCardsProps {
    quotes: ThemeColumn[]
    onDelete: (id: string) => void
    onEdit: (id: string) => void
}

export function QuoteCards({ quotes, onDelete, onEdit }: QuoteCardsProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredQuotes, setFilteredQuotes] = useState(quotes)

    useEffect(() => {
        setFilteredQuotes(
            quotes.filter(
                (quote) =>
                    searchQuery === "" ||
                    quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    quote.theme.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        )
    }, [quotes, searchQuery])

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search quotes..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="space-y-3">
                {filteredQuotes.length > 0 ? (
                    <>
                        {filteredQuotes.map((quote) => (
                            <Card key={quote.id}>
                                <CardContent>
                                    <div className="flex w-full mb-2">
                                        <Badge variant="outline">{quote.theme}</Badge>
                                        <div className="grow gap-2 flex justify-end items-center">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => onDelete(quote.id)}
                                                aria-label="Delete quote"
                                                className="h-8 px-2"
                                            >
                                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                                <span className="ml-1">Delete</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => onEdit(quote.id)}
                                                aria-label="Practice quote"
                                                className="h-8 px-2"
                                            >
                                                <Pencil className="h-4 w-4 text-muted-foreground" />
                                                <span className="ml-1">Edit</span>
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="font-medium">{quote.text}</p>
                                </CardContent>
                            </Card>
                        ))}
                        <div className="text-sm text-muted-foreground pt-2">{filteredQuotes.length} quote(s) total.</div>
                    </>
                ) : (
                    <div className="text-center p-4 text-muted-foreground border rounded-md">
                        No quotes found. Try adjusting your search or filter.
                    </div>
                )}
            </div>
        </div>
    )
}

