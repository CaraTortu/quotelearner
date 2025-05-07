"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/app/_components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/app/_components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "~/app/_components/ui/popover"

interface ThemeComboboxProps {
    themes: string[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function ThemeCombobox({ themes, value, onChange, placeholder = "Select theme..." }: ThemeComboboxProps) {
    const [open, setOpen] = React.useState(false)

    const allThemes = ["all", ...themes]
    const displayValue = value === "all" ? "All Themes" : value


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[250px] justify-between">
                    {value ? displayValue : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput placeholder="Search themes..." />
                    <CommandList>
                        <CommandEmpty>No theme found.</CommandEmpty>
                        <CommandGroup>
                            {allThemes.map((theme) => (
                                <CommandItem
                                    key={theme}
                                    value={theme}
                                    onSelect={() => {
                                        onChange(theme)
                                        setOpen(false)
                                    }}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", value === theme ? "opacity-100" : "opacity-0")} />
                                    {theme === "all" ? "All Themes" : theme}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

