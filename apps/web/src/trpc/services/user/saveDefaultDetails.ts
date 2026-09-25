import { defaultDetailsSchema } from "@/zod-schemas/invoice/default-details";
import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { InternalServerError } from "@/lib/effect/error/trpc";
import { SUCCESS_MESSAGES } from "@/constants/issues";
import { TRPCError } from "@trpc/server";
import { db, schema } from "@hetam/db";
import { Effect } from "effect";

export const saveDefaultDetails = authorizedProcedure.input(defaultDetailsSchema).mutation(async ({ ctx, input }) => {
  const saveDefaultDetailsEffect = Effect.gen(function* () {
    yield* Effect.tryPromise({
      try: () =>
        db
          .insert(schema.userDefaultDetails)
          .values({
            userId: ctx.auth.user.id,
            companyDetails: input.companyDetails,
            clientDetails: input.clientDetails,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: schema.userDefaultDetails.userId,
            set: {
              companyDetails: input.companyDetails,
              clientDetails: input.clientDetails,
              updatedAt: new Date(),
            },
          }),
      catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
    });

    return {
      success: true,
      message: SUCCESS_MESSAGES.DEFAULT_DETAILS_SAVED,
    };
  });

  return Effect.runPromise(
    saveDefaultDetailsEffect.pipe(
      Effect.catchTags({
        InternalServerError: (error) =>
          Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
      }),
    ),
  );
});
