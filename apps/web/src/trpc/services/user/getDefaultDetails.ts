import { defaultDetailsSchema, type ZodDefaultDetailsSchema } from "@/zod-schemas/invoice/default-details";
import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { InternalServerError } from "@/lib/effect/error/trpc";
import { TRPCError } from "@trpc/server";
import { db, schema } from "@hetam/db";
import { eq } from "drizzle-orm";
import { Effect } from "effect";

export const getDefaultDetails = authorizedProcedure.query(async ({ ctx }): Promise<ZodDefaultDetailsSchema | null> => {
  const getDefaultDetailsEffect = Effect.gen(function* () {
    const details = yield* Effect.tryPromise({
      try: () =>
        db.query.userDefaultDetails.findFirst({
          where: eq(schema.userDefaultDetails.userId, ctx.auth.user.id),
        }),
      catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
    });

    if (!details) {
      return null;
    }

    const parsed = defaultDetailsSchema.safeParse({
      companyDetails: details.companyDetails,
      clientDetails: details.clientDetails,
    });

    if (!parsed.success) {
      return null;
    }

    return parsed.data;
  });

  return Effect.runPromise(
    getDefaultDetailsEffect.pipe(
      Effect.catchTags({
        InternalServerError: (error) =>
          Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
      }),
    ),
  );
});
