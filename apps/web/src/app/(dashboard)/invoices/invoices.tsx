"use client";

import { Alert, AlertButtonGroup, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { columnConfig, columns } from "@/components/table-columns/invoices";
import { LoginModal } from "@/components/layout/auth/login-modal";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/client-auth";
import { useTRPC } from "@/trpc/client";
import React from "react";

const InvoicesPage = () => {
  const trpc = useTRPC();
  const { data: session, isPending: isSessionPending } = useSession();

  // Fetching Invoices from the Postgres (Server)
  const trpcData = useQuery({
    ...trpc.invoice.list.queryOptions(),
    enabled: !!session?.user,
  });

  if (!isSessionPending && !session?.user) {
    return (
      <div className="dash-page flex h-[calc(100svh-120px)] flex-col items-center justify-center gap-4 p-4 text-center">
        <div className="flex max-w-sm flex-col items-center gap-2">
          <h2 className="instrument-serif text-3xl font-semibold">Sign in to view invoices</h2>
          <p className="text-muted-foreground text-sm">
            All invoices are securely saved to your account in the cloud. Log in to view and manage them.
          </p>
          <LoginModal
            trigger={
              <Button className="mt-2" variant="default">
                Login with Google
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const isLoading = isSessionPending || trpcData.isLoading;
  const data = trpcData.data ?? [];

  return (
    <div className="dash-page gap-4 p-4">
      {trpcData.isError && (
        <Alert variant="destructive">
          <AlertTitle>Server Fetch Failed!</AlertTitle>
          <AlertDescription>
            We were unable to fetch your invoices from the server. Please try again later.
          </AlertDescription>
          <AlertButtonGroup>
            <Button onClick={() => trpcData.refetch()} variant="destructive" size="xs">
              Retry
            </Button>
          </AlertButtonGroup>
        </Alert>
      )}
      <DataTable
        isLoading={isLoading}
        data={data}
        columns={columns}
        columnConfig={columnConfig}
        defaultSorting={[{ id: "createdAt", desc: true }]}
      />
    </div>
  );
};

export default InvoicesPage;
