"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "~/app/_components/ui/button"
import { Card, CardContent } from "~/app/_components/ui/card"
import { Input } from "~/app/_components/ui/input"
import { Label } from "~/app/_components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/app/_components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/app/_components/ui/tabs"
import { Check, PlusIcon, X } from "lucide-react"
import { useRouter } from "next/navigation"

type Difficulty = "easy" | "medium" | "hard"

export default function QuotePractice({ quotesByTheme }: { quotesByTheme: Map<string, string[]> }) {
    const router = useRouter()
    const quoteKeys = useMemo(() => Array.from(quotesByTheme.keys()), [quotesByTheme])
    const [theme, setTheme] = useState(quoteKeys[0]!)

    const [difficulty, setDifficulty] = useState<Difficulty>("medium")
    const [currentQuote, setCurrentQuote] = useState("")
    const [blankedQuote, setBlankedQuote] = useState<Array<{ word: string; isBlank: boolean }>>([])
    const [userInputs, setUserInputs] = useState<string[]>([])
    const [results, setResults] = useState<Array<{ correct: boolean; correctWord: string }>>([])
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [score, setScore] = useState(0)

    const generateNewQuote = useCallback(() => {
        if (quoteKeys.length === 0) return;
        // Reset state
        setIsSubmitted(false)
        setResults([])
        setScore(0)

        // Select random quote from the theme
        const quotes = quotesByTheme.get(theme)!
        const randomIndex = Math.floor(Math.random() * quotes.length)
        const quote = quotes[randomIndex]!
        setCurrentQuote(quote)

        // Create blanks based on difficulty
        const words = quote.split(" ")
        const blankedWords = createBlanks(words, difficulty)
        setBlankedQuote(blankedWords)

        // Initialize user inputs array with empty strings for each blank
        const blankCount = blankedWords.filter((word) => word.isBlank).length
        setUserInputs(Array(blankCount).fill(""))
    }, [difficulty, quoteKeys.length, quotesByTheme, theme])

    // Generate a new quote with blanks based on theme and difficulty
    useEffect(() => {
        generateNewQuote()
    }, [theme, difficulty, generateNewQuote])

    const createBlanks = (words: string[], difficulty: Difficulty) => {
        // Remove punctuation for word selection
        const cleanWords = words.map((word) => word.replace(/[.,!?;:'"()]/g, ""))

        // Determine how many words to blank out based on difficulty
        let blankPercentage = 0
        switch (difficulty) {
            case "easy":
                blankPercentage = 0.15
                break
            case "medium":
                blankPercentage = 0.25
                break
            case "hard":
                blankPercentage = 0.4
                break
        }

        // Calculate number of words to blank
        const numBlanks = Math.max(1, Math.floor(words.length * blankPercentage))

        // Find words with length > 3 (more meaningful words)
        const eligibleIndices = cleanWords
            .map((word, index) => (word.length > 3 ? index : -1))
            .filter((index) => index !== -1)

        // Randomly select indices to blank
        const blankedIndices: number[] = []
        while (blankedIndices.length < numBlanks && eligibleIndices.length > 0) {
            const randomIndex = Math.floor(Math.random() * eligibleIndices.length)
            blankedIndices.push(eligibleIndices[randomIndex]!)
            eligibleIndices.splice(randomIndex, 1)
        }

        // Create the blanked quote structure
        return words.map((word, index) => ({
            word,
            isBlank: blankedIndices.includes(index),
        }))
    }

    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...userInputs]
        newInputs[index] = value
        setUserInputs(newInputs)
    }

    const handleSubmit = () => {
        // Get all blanked words
        const blankedWords = blankedQuote
            .filter((word) => word.isBlank)
            .map((word) => word.word.replace(/[.,!?;:'"()]/g, ""))

        // Compare user inputs with correct words
        const newResults = blankedWords.map((correctWord, index) => {
            const userInput = userInputs[index]?.trim() ?? ""
            const isCorrect = userInput.toLowerCase() === correctWord.toLowerCase()
            return { correct: isCorrect, correctWord }
        })

        setResults(newResults)
        setIsSubmitted(true)

        // Calculate score
        const correctCount = newResults.filter((result) => result.correct).length
        setScore(Math.round((correctCount / blankedWords.length) * 100))
    }

    const handleReset = () => {
        generateNewQuote()
    }

    const handleContinuePracticing = () => {
        setIsSubmitted(false)
        setResults([])
    }

    // Track blank index for input fields
    let blankIndex = 0

    if (quoteKeys.length === 0) {
        return (
            <div className="flex flex-col gap-4 justify-center items-center">
                <p className="text-lg">No quotes found!</p>
                <Button size="default" className="flex gap-2 cursor-pointer" onClick={() => router.push("/quote-management")}>
                    <PlusIcon className="size-4" />
                    <span>Add quotes</span>
                </Button>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-6 grid gap-4 grid-cols-2 place-items-center">
                <div className="flex flex-col gap-2 w-fit">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={theme} onValueChange={(value) => setTheme(value)}>
                        <SelectTrigger id="theme">
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from(quotesByTheme.keys()).map(k => (
                                <SelectItem key={k} value={k}>{k}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2 w-fit">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                        <SelectTrigger id="difficulty">
                            <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="mb-6">
                <CardContent className="px-4">
                    <div className="text-base sm:text-lg leading-relaxed">
                        {blankedQuote.map((item, index) => {
                            if (!item.isBlank) {
                                return <span key={index}>{item.word} </span>
                            } else {
                                const currentBlankIndex = blankIndex
                                blankIndex++

                                return (
                                    <span key={index} className="inline-block mx-1 py-1">
                                        <Input
                                            className={`w-20 sm:w-24 inline-block ${isSubmitted
                                                ? results[currentBlankIndex]?.correct
                                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                                    : "border-red-500 bg-red-50 dark:bg-red-900/20"
                                                : ""
                                                }`}
                                            value={userInputs[currentBlankIndex] ?? ""}
                                            disabled={isSubmitted}
                                            onChange={(e) => handleInputChange(currentBlankIndex, e.target.value)}
                                        />
                                        {isSubmitted && (
                                            <span className="ml-1">
                                                {results[currentBlankIndex]?.correct ? (
                                                    <Check className="inline h-4 w-4 text-green-500" />
                                                ) : (
                                                    <X className="inline h-4 w-4 text-red-500" />
                                                )}
                                            </span>
                                        )}{" "}
                                    </span>
                                )
                            }
                        })}
                    </div>

                    {isSubmitted && (
                        <div className="mt-4 rounded-lg bg-slate-50 p-3 sm:p-4 dark:bg-slate-800 text-sm sm:text-base">
                            <h3 className="mb-2 font-semibold">Results</h3>
                            <p className="mb-2">
                                Your score: <span className="font-bold">{score}%</span>
                            </p>

                            <Tabs defaultValue="all">
                                <TabsList className="mb-2">
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="incorrect">Incorrect</TabsTrigger>
                                </TabsList>
                                <TabsContent value="all">
                                    <ul className="space-y-1">
                                        {results.map((result, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                {result.correct ? (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <X className="h-4 w-4 text-red-500" />
                                                )}
                                                <span>
                                                    {result.correct ? (
                                                        <span>
                                                            Correct: <span className="font-medium">{result.correctWord}</span>
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            You entered: <span className="font-medium">{userInputs[index]}</span>, Correct:{" "}
                                                            <span className="font-medium">{result.correctWord}</span>
                                                        </span>
                                                    )}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </TabsContent>
                                <TabsContent value="incorrect">
                                    <ul className="space-y-1">
                                        {results
                                            .map((result, index) => ({ ...result, index }))
                                            .filter((result) => !result.correct)
                                            .map((result) => (
                                                <li key={result.index} className="flex items-center gap-2">
                                                    <X className="h-4 w-4 text-red-500" />
                                                    <span>
                                                        You entered: <span className="font-medium">{userInputs[result.index]}</span>, Correct:{" "}
                                                        <span className="font-medium">{result.correctWord}</span>
                                                    </span>
                                                </li>
                                            ))}
                                    </ul>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2 items-center justify-center">
                {!isSubmitted ? (
                    <Button onClick={handleSubmit}>Check Answers</Button>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={handleContinuePracticing}>Try again</Button>
                        <Button onClick={handleReset} variant="secondary">Try Another Quote</Button>
                    </div>
                )}
                {!isSubmitted && (
                    <Button variant="outline" onClick={generateNewQuote}>
                        New Quote
                    </Button>
                )}
            </div>
        </div>
    )
}

