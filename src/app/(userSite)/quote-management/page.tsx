"use client"

import { useState, useCallback, useEffect } from "react"
import { PlusCircle, UploadIcon } from "lucide-react"
import { Button } from "~/app/_components/ui/button"
import { Input } from "~/app/_components/ui/input"
import { Label } from "~/app/_components/ui/label"
import { Textarea } from "~/app/_components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/app/_components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/app/_components/ui/dialog"
import { ThemeCombobox } from "~/app/_components/ui/content/theme-combobox"
import { TableThemes, type ThemeColumn } from "~/app/_components/ui/content/table-themes"
import { useIsMobile } from "~/hooks/use-mobile"
import { QuoteCards } from "~/app/_components/ui/content/mobile-quote-cards"
import { api } from "~/trpc/react"
import { useToast } from "~/hooks/use-toast"

export default function QuotesPage() {
    const isMobile = useIsMobile()
    const { toast } = useToast()
    const [quotes, setQuotes] = useState<ThemeColumn[]>([])
    const quoteQuery = api.quotes.getQuotes.useQuery()

    useEffect(() => {
        if (!quoteQuery.isSuccess) {
            return
        }

        setQuotes(quoteQuery.data.quotes)
    }, [quoteQuery.data?.quotes, quoteQuery.isSuccess])


    const [newQuote, setNewQuote] = useState({
        text: "",
        theme: "",
    })

    const [isAddingNewTheme, setIsAddingNewTheme] = useState(false)
    const [newThemeText, setNewThemeText] = useState("")
    const [addNewQuoteOpen, setAddNewQuoteOpen] = useState(false)
    const [importQuotesOpen, setImportQuotesOpen] = useState(false)
    const [activeTheme, setActiveTheme] = useState("all")
    const [file, setFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] ?? null)
    }

    const themes = Array.from(new Set(quotes.map((quote) => quote.theme)))

    const handleThemeChange = (value: string) => {
        if (value === "New") {
            setIsAddingNewTheme(true)
            setNewThemeText("")
        } else {
            setIsAddingNewTheme(false)
            setNewQuote({ ...newQuote, theme: value })
        }
    }

    const handleFilterThemeChange = useCallback((theme: string) => {
        setActiveTheme(theme)
    }, [])

    const addQuoteMutation = api.quotes.addQuotes.useMutation()
    const addQuote = async () => {
        const themeToUse = isAddingNewTheme ? newThemeText : newQuote.theme

        if (newQuote.text && themeToUse) {
            await addQuoteMutation.mutateAsync(newQuote.text.split("\n").map(s => ({
                text: s.trim(),
                theme: themeToUse
            })).filter(s => s.text !== ""))

            await quoteQuery.refetch()

            setNewQuote({ text: "", theme: "" })
            setIsAddingNewTheme(false)
            setNewThemeText("")
            setAddNewQuoteOpen(false)
            toast({
                title: "Quote added successfully!"
            })
        }
    }

    const deleteQuoteMutation = api.quotes.deleteQuotes.useMutation()
    const deleteQuote = useCallback(async (id: string) => {
        const result = await deleteQuoteMutation.mutateAsync([{ id }])

        if (result.success) {
            setQuotes(quotes.filter((quote) => quote.id !== id))
            toast({
                title: "Quote deleted successfully!"
            })
        } else {
            toast({
                title: "Quote deletion failed. Try again later..."
            })
        }
    }, [deleteQuoteMutation, quotes, toast])

    const deleteMultipleQuotes = useCallback(async (ids: { id: string }[]) => {
        const result = await deleteQuoteMutation.mutateAsync(ids)
        const ids_mp = ids.map(id => id.id)

        if (result.success) {
            setQuotes(quotes.filter((quote) => !ids_mp.includes(quote.id)))

            toast({
                title: "Quotes deleted successfully!"
            })
        } else {
            toast({
                title: "Quotes deletion failed. Try again later..."
            })
        }
    }, [deleteQuoteMutation, quotes, toast])

    const handleImportQuotes = useCallback(async () => {
        if (!file) return
        const themeToUse = isAddingNewTheme ? newThemeText : newQuote.theme
        const text = await file.text()
        const lines = text.split("\n").filter((line) => line.trim())

        await addQuoteMutation.mutateAsync(lines.map(l => ({ text: l, theme: themeToUse })))
        await quoteQuery.refetch()

        toast({ title: "Quotes imported successfully!" })
        setImportQuotesOpen(false)
        setIsAddingNewTheme(false)
        setNewThemeText("")
    }, [addQuoteMutation, file, isAddingNewTheme, newQuote.theme, newThemeText, quoteQuery, toast])

    const filteredQuotes = quotes.filter((quote) => activeTheme === "all" || quote.theme === activeTheme)

    return (
        <div className="container mx-auto py-6 px-4 grow">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quote Collection</h1>
                <div className="flex gap-2 flex-wrap">
                    <Dialog open={addNewQuoteOpen} onOpenChange={setAddNewQuoteOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Add Quote
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Quote</DialogTitle>
                                <DialogDescription>Add a new quote to your collection for practice.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="quote-text">Quote(s): {newQuote.text.split("\n").filter(s => s.trim() !== "").length}</Label>
                                    <Textarea
                                        id="quote-text"
                                        placeholder="Enter the quote text. If you want to add multiple quotes, you can add them in different lines"
                                        value={newQuote.text}
                                        onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="theme">Theme/Source</Label>
                                    <div className="space-y-2">
                                        {!isAddingNewTheme ? (
                                            <Select value={newQuote.theme} onValueChange={handleThemeChange} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a theme" className="cursor-pointer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {themes.map((theme) => (
                                                        <SelectItem key={theme} value={theme}>
                                                            {theme}
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem value="New">+ Add new theme</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <Input
                                                    placeholder="Enter new theme"
                                                    value={newThemeText}
                                                    onChange={(e) => setNewThemeText(e.target.value)}
                                                />
                                                <Button variant="outline" onClick={() => setIsAddingNewTheme(false)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setAddNewQuoteOpen(false)
                                        setIsAddingNewTheme(false)
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={addQuote} disabled={newQuote.text === "" || (isAddingNewTheme ? newThemeText : newQuote.theme) === ""}>Add Quote</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={importQuotesOpen} onOpenChange={setImportQuotesOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2" variant="secondary">
                                <UploadIcon className="h-4 w-4" />
                                Import quotes
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Import New Quote</DialogTitle>
                                <DialogDescription>Import quotes to your collection for practice.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="quote-text">Quote file</Label>
                                    <Input
                                        id="quote-text"
                                        type="file"
                                        accept=".txt"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="theme">Theme/Source</Label>
                                    <div className="space-y-2">
                                        {!isAddingNewTheme ? (
                                            <Select value={newQuote.theme} onValueChange={handleThemeChange} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a theme" className="cursor-pointer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {themes.map((theme) => (
                                                        <SelectItem key={theme} value={theme}>
                                                            {theme}
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem value="New">+ Add new theme</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <Input
                                                    placeholder="Enter new theme"
                                                    value={newThemeText}
                                                    onChange={(e) => setNewThemeText(e.target.value)}
                                                />
                                                <Button variant="outline" onClick={() => setIsAddingNewTheme(false)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setImportQuotesOpen(false)
                                        setIsAddingNewTheme(false)
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={() => handleImportQuotes()} disabled={file === null || (isAddingNewTheme ? newThemeText : newQuote.theme) === ""}>Import Quotes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center gap-2">
                    <Label htmlFor="theme-filter" className="whitespace-nowrap">
                        Filter by theme:
                    </Label>
                    <ThemeCombobox
                        themes={themes}
                        value={activeTheme}
                        onChange={handleFilterThemeChange}
                        placeholder="Select theme"
                    />
                </div>
            </div>

            {
                isMobile ? (
                    <QuoteCards quotes={filteredQuotes} onDelete={deleteQuote} onEdit={(id) => console.log(id)} />
                ) : (
                    <TableThemes
                        isPending={quoteQuery.isLoading}
                        themes={filteredQuotes}
                        onDelete={deleteQuote}
                        onDeleteAll={(rows) => deleteMultipleQuotes(rows.map(r => ({ id: r.id })))}
                        onEdit={(id) => console.log(id)}
                    />
                )
            }
        </div >
    )
}

