import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import type { InvoiceTypeType } from "@hetam/db/schema/invoice";
import { trpcProxyClient } from "@/trpc/client";
import { AuthUser } from "@/types/auth";
import { toast } from "sonner";

export const editInvoice = async (
  invoice: ZodCreateInvoiceSchema,
  user: AuthUser | undefined,
  _type: InvoiceTypeType,
  id: string,
) => {
  if (!user) {
    toast.error("Authentication required", {
      description: "Please log in to edit invoices on the server.",
    });
    return;
  }

  try {
    const response = await trpcProxyClient.invoice.edit.mutate({
      id,
      invoice,
    });

    if (!response.success) {
      toast.error(ERROR_MESSAGES.DATABASE_ERROR, {
        description: ERROR_MESSAGES.FAILED_TO_EDIT_INVOICE,
      });
    } else {
      toast.success(SUCCESS_MESSAGES.INVOICE_EDITED, {
        description: SUCCESS_MESSAGES.INVOICE_EDITED_DESCRIPTION,
      });
    }
  } catch {
    toast.error(ERROR_MESSAGES.DATABASE_ERROR, {
      description: ERROR_MESSAGES.FAILED_TO_EDIT_INVOICE,
    });
  }
};
