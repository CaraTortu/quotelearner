import { headers } from "next/headers";
import AccountEdit from "~/app/_components/ui/account/account-edit";
import { Avatar, AvatarFallback, AvatarImage } from "~/app/_components/ui/avatar";
import { Card, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { Separator } from "~/app/_components/ui/separator";
import { auth } from "~/server/auth";

export default async function Account() {
    const { user } = (await auth.api.getSession({
        headers: await headers(),
        query: {
            disableCookieCache: true
        }
    }))!;

    return (
        <div className="grow flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            <Card className="w-full max-w-(--breakpoint-sm)">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                </CardHeader>
                <Separator />
                <AccountEdit user={user} />
            </Card>
        </div>
    )
}
