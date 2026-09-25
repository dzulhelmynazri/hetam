import { cloudflareRouter } from "@/trpc/services/cloudflare";
import { invoiceRouter } from "@/trpc/services/invoice";
import { userRouter } from "@/trpc/services/user";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  invoice: invoiceRouter,
  cloudflare: cloudflareRouter,
  user: userRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
