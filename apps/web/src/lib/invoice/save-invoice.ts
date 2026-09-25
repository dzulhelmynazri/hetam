import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import { trpcProxyClient } from "@/trpc/client";
import { redirect } from "next/navigation";
import { AuthUser } from "@/types/auth";
import { toast } from "sonner";

export const saveInvoiceToDatabase = async (invoice: ZodCreateInvoiceSchema, user: AuthUser | undefined) => {
  if (!user) {
    toast.error("Authentication required", {
      description: "Please log in to save your invoice to the server.",
    });
    return;
  }

  try {
    const insertedInvoice = await trpcProxyClient.invoice.insert.mutate(invoice);

    if (!insertedInvoice.success || !insertedInvoice.invoiceId) {
      toast.error(ERROR_MESSAGES.DATABASE_ERROR, {
        description: ERROR_MESSAGES.FAILED_TO_INSERT_DATA,
      });
      return;
    }

    toast.success(SUCCESS_MESSAGES.INVOICE_SAVED, {
      description: SUCCESS_MESSAGES.INVOICE_SAVED_DESCRIPTION,
    });

    redirect(`/edit/server/${insertedInvoice.invoiceId}`);
  } catch {
    toast.error(ERROR_MESSAGES.DATABASE_ERROR, {
      description: ERROR_MESSAGES.FAILED_TO_INSERT_DATA,
    });
  }
};
