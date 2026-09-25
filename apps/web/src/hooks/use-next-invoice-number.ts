"use client";

import { getNextInvoiceNumber } from "@/lib/invoice/get-next-invoice-number";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/client-auth";
import { useTRPC } from "@/trpc/client";
import { useMemo } from "react";

export function useNextInvoiceNumber() {
  const trpc = useTRPC();
  const { data: session, isPending: isSessionPending } = useSession();

  // Server invoices (Postgres) ~ fetched when user is logged in
  const serverInvoices = useQuery({
    ...trpc.invoice.list.queryOptions(),
    enabled: !!session?.user,
  });

  const isLoading = isSessionPending || serverInvoices.isLoading;

  const nextInvoiceNumber = useMemo(() => getNextInvoiceNumber(serverInvoices.data ?? []), [serverInvoices.data]);

  return { nextInvoiceNumber, isLoading };
}
