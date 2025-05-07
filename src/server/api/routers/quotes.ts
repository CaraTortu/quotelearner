import { and, eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { quotes } from "~/server/db/schema";

export const quoteRouter = createTRPCRouter({
    addQuote: protectedProcedure
        .input(
            z.array(
                z.object({
                    text: z.string().nonempty(),
                    theme: z.string().nonempty(),
                }),
            ),
        )
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db
                .insert(quotes)
                .values(
                    input.map((i) => ({
                        userId: ctx.session.user.id,
                        text: i.text,
                        theme: i.theme,
                    })),
                )
                .returning();

            return { success: result.length > 0 };
        }),
    getQuotes: protectedProcedure.query(async ({ ctx }) => {
        const result = await ctx.db.query.quotes.findMany({
            where: eq(quotes.userId, ctx.session.user.id),
            columns: {
                userId: false,
            },
        });

        return { success: true, quotes: result };
    }),
    deleteQuote: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db
                .delete(quotes)
                .where(
                    and(
                        eq(quotes.userId, ctx.session.user.id),
                        eq(quotes.id, input.id),
                    ),
                );

            return { success: result.rowCount > 0 };
        }),
});
