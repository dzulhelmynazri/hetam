"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContentContainer,
  DialogHeaderContainer,
  DialogIcon,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { InvoiceTypeType } from "@hetam/db/schema/invoice";
import { FormButton } from "@/components/ui/form/form-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "@/assets/icons";
import { useForm } from "react-hook-form";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface DeleteInvoiceModalProps {
  type?: InvoiceTypeType;
  invoiceId: string;
}

const deleteInvoiceSchema = z.object({
  id: z.string(),
});

type DeleteInvoiceSchema = z.infer<typeof deleteInvoiceSchema>;

const DeleteInvoiceModal = ({ invoiceId }: DeleteInvoiceModalProps) => {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Postgres Mutation
  const deleteServerInvoiceMutation = useMutation(
    trpc.invoice.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Invoice deleted successfully!", {
          description: "The invoice has been deleted from the database.",
        });
        queryClient.invalidateQueries({ queryKey: trpc.invoice.list.queryKey() });
      },
      onError: (error) => {
        toast.error("Failed to delete invoice!", {
          description: parseCatchError(error),
        });
      },
    }),
  );

  const form = useForm<DeleteInvoiceSchema>({
    resolver: zodResolver(deleteInvoiceSchema),
    defaultValues: {
      id: invoiceId,
    },
  });

  const onSubmit = async () => {
    await deleteServerInvoiceMutation.mutateAsync({
      id: invoiceId,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <TrashIcon />
          <span>Delete</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent hideCloseButton>
        <DialogHeaderContainer>
          <DialogHeader>
            <DialogIcon>
              <TrashIcon />
            </DialogIcon>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invoice? This will permanently delete the invoice from the server.
            </DialogDescription>
          </DialogHeader>
        </DialogHeaderContainer>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogContentContainer className="flex flex-col gap-2">
              <Alert variant="destructive">
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  This action is irreversible. It will permanently remove this invoice from your account.
                </AlertDescription>
              </Alert>
              <div className="flex flex-col gap-2">
                <Label>Invoice ID</Label>
                <Input value={invoiceId} disabled />
              </div>
            </DialogContentContainer>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" size="xs">
                  Cancel
                </Button>
              </DialogClose>
              <FormButton disabled={deleteServerInvoiceMutation.isPending} variant="destructive" size="xs">
                Delete
              </FormButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInvoiceModal;
