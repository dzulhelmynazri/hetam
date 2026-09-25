import { invoiceTypeEnum } from "@hetam/db/schema/invoice";
import { z } from "zod";

export const EditInvoicePageSchema = z.object({
  type: z.enum(invoiceTypeEnum.enumValues),
  id: z.string().uuid(),
});
