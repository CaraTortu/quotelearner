import Link from 'next/link'
import { Separator } from '../ui/separator';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="flex items-center border-t px-6 py-4">
            {/* Copyright and Social Media in a Flexbox */}
            <div className="flex items-center w-full flex-wrap md:flex-nowrap gap-4 md:gap-8">
                <p className="text-nowrap text-black/70 dark:text-primary-foreground">{"©"} {currentYear} QuoteLearner</p>
                <div className='h-7 w-1 flex'>
                    <Separator orientation='vertical' />
                </div>
                <div className="flex gap-2 md:gap-8 md:items-center">
                    <Link href="/terms" className='underline'>Terms and Conditions</Link>
                </div>
            </div>
        </footer>
    );
}

