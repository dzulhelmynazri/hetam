"use client";

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import InvoicePage from "@/app/(dashboard)/create/invoice/invoice";
import type { InvoiceTypeType } from "@hetam/db/schema/invoice";
import PDFLoading from "@/components/layout/pdf/pdf-loading";
import React, { useEffect, useState } from "react";
import { Invoice } from "@/types/common/invoice";
import { trpcProxyClient } from "@/trpc/client";

interface EditInvoiceProps {
  type: InvoiceTypeType;
  id: string;
}

const EditInvoice = ({ id }: EditInvoiceProps) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true);
      try {
        const fetchedInvoice = await trpcProxyClient.invoice.get.query({
          id: id,
        });

        if (fetchedInvoice) {
          setInvoice(fetchedInvoice);
          setIsLoading(false);
        } else {
          throw new Error(ERROR_MESSAGES.INVOICE_NOT_FOUND);
        }
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    };

    fetchInvoice();
  }, [id]);

  if (isLoading) {
    return (
      <PDFLoading
        message={SUCCESS_MESSAGES.FETCHING_INVOICE}
        description={SUCCESS_MESSAGES.FETCHING_INVOICE_DESCRIPTION}
      />
    );
  }

  return <InvoicePage defaultInvoice={invoice?.invoiceFields} />;
};

export default EditInvoice;
