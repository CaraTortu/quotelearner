import QuotePractice from "~/app/_components/ui/content/quote-practise"
import { api } from "~/trpc/server"

export default async function Practise() {
    const quotes = await api.quotes.getQuotesByTheme()
    return (
        <main className="container mx-auto px-4 py-8 grow">
            <h1 className="mb-8 text-center text-3xl font-bold">Quote Practice</h1>
            <QuotePractice quotesByTheme={quotes.quotesByTheme} />
        </main>
    )
}

