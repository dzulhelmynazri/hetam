import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogContentContainer,
  DialogDescription,
  DialogHeader,
  DialogHeaderContainer,
  DialogIcon,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { importInvoiceColumnConfig, importInvoiceColumns } from "@/components/table-columns/invoices";
import { DataTable } from "@/components/ui/data-table";
import { InboxArrowDownIcon } from "@/assets/icons";
import { Invoice } from "@/types/common/invoice";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/client-auth";
import { useTRPC } from "@/trpc/client";

const ImportInvoice = ({ form }: { form: UseFormReturn<ZodCreateInvoiceSchema> }) => {
  const [open, setOpen] = React.useState(false);

  const trpc = useTRPC();
  const { data: session } = useSession();

  // Fetching Invoices from the Postgres (Server)
  const trpcData = useQuery({
    ...trpc.invoice.list.queryOptions(),
    enabled: !!session?.user,
  });

  const isLoading = trpcData.isLoading;
  const data = trpcData.data ?? [];

  const handleRowClick = (invoice: Invoice) => {
    // Reset form field to imported invoice
    form.reset(invoice.invoiceFields);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <InboxArrowDownIcon />
          <span>Import Invoice</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-fit" hideCloseButton>
        <DialogHeaderContainer>
          <DialogHeader>
            <DialogIcon>
              <InboxArrowDownIcon />
            </DialogIcon>
            <DialogTitle>Import Invoice</DialogTitle>
            <DialogDescription>
              Select an invoice from your account to pre-fill the form with its details.
            </DialogDescription>
          </DialogHeader>
        </DialogHeaderContainer>
        <DialogContentContainer>
          <div className="flex flex-col gap-4">
            <DataTable
              onRowClick={handleRowClick}
              isLoading={isLoading}
              data={data}
              columns={importInvoiceColumns}
              columnConfig={importInvoiceColumnConfig}
              defaultSorting={[{ id: "createdAt", desc: true }]}
            />
          </div>
        </DialogContentContainer>
      </DialogContent>
    </Dialog>
  );
};

export default ImportInvoice;
