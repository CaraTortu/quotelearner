import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { env } from "~/env";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { sendPasswordResetEmail } from "../emails";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";
import { getBaseUrl } from "~/lib/utils";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    baseURL: getBaseUrl(),
    advanced: {
        generateId: false,
    },
    account: {
        accountLinking: {
            enabled: true,
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "user",
                input: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        sendResetPassword: async ({ user, url }, _req) => {
            await sendPasswordResetEmail(user, url);
        },
    },
    socialProviders: {
        google: {
            clientId: env.AUTH_GOOGLE_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET,
        },
    },
    databaseHooks: {
        session: {
            create: {
                after: async (session) => {
                    await db
                        .update(user)
                        .set({ lastLoginAt: new Date() })
                        .where(eq(user.id, session.userId))
                        .execute();
                },
            },
        },
    },

    plugins: [admin(), nextCookies()],
});

// Export types
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
