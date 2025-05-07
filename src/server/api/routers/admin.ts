import { adminProcedure, createTRPCRouter } from "../trpc";
import { eq } from "drizzle-orm";
import { user } from "~/server/db/schema";
import { updateUserSchema } from "~/lib/schemas";

export const adminRouter = createTRPCRouter({
    /**
     * USER MANAGEMENT
     */
    getUsers: adminProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.user.findMany();
    }),

    updateUser: adminProcedure
        .input(updateUserSchema)
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db
                .update(user)
                .set({
                    name: input.name,
                    email: input.email,
                    image: input.image,
                    emailVerified: input.emailVerified,
                    role: input.role,
                })
                .where(eq(user.id, input.id))
                .returning();

            return { success: result.length > 0 };
        }),
});
