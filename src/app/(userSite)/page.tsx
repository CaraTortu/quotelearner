import Link from "next/link";
import { Button } from "~/app/_components/ui/button";
import { auth } from "~/server/auth";
import { headers } from "next/headers";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return (
        <div className="flex flex-col mt-[-3rem]">
            <section className="md:mt-[-4rem] w-full h-full min-h-screen bg-linear-to-r from-blue-500 to-green-400 dark:from-blue-800 dark:to-green-600 flex items-center justify-center">
                <div className="mx-auto text-center text-white flex flex-col gap-2 items-center px-4">
                    <h1 className="text-3xl md:text-5xl font-bold">Ace Your Leaving Certificate Quotes with confidence</h1>
                    <p className="text-xl md:text-2xl font-light">Need to study some quotes? Try our tool for free!</p>
                    <div className="flex gap-2 items-center justify-center  mt-8">
                        <Link href={session ? "/practise" : "/register"}>
                            <Button size="lg" className="w-fit">
                                Start Your Journey
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div >
    );
}
