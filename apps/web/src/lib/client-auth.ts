import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { serverAuth } from "./auth";
import { env } from "@hetam/utilities";

export const clientAuth = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  plugins: [inferAdditionalFields<typeof serverAuth>()],
});

// For faster use :3
export const { getSession, useSession } = clientAuth;
