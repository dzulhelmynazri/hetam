import { saveDefaultDetails } from "./saveDefaultDetails";
import { getDefaultDetails } from "./getDefaultDetails";
import { createTRPCRouter } from "@/trpc/init";

export const userRouter = createTRPCRouter({
  getDefaultDetails,
  saveDefaultDetails,
});
