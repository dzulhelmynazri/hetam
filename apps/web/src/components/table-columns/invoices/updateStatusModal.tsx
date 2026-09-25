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
import {
  FileAlertIcon,
  FileBanIcon,
  FileCheckIcon,
  FileRefreshIcon,
  HourglassStartIcon,
  PriorityMediumIcon,
} from "@/assets/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { InvoiceTypeType } from "@hetam/db/schema/invoice";
import { FormSelect } from "@/components/ui/form/form-select";
import { FormButton } from "@/components/ui/form/form-button";
import { invoiceStatusEnum } from "@hetam/db/schema/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectItem } from "@/components/ui/select";
import { Form } from "@/components/ui/form/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface UpdateStatusModalProps {
  type?: InvoiceTypeType;
  invoiceId: string;
  currentStatus: string;
}

const invoiceStatusSchema = z.object({
  id: z.string(),
  status: z.enum(invoiceStatusEnum.enumValues),
});

type InvoiceStatusSchema = z.infer<typeof invoiceStatusSchema>;

const UpdateStatusModal = ({ invoiceId, currentStatus }: UpdateStatusModalProps) => {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Postgres Mutation
  const updateServerInvoiceStatusMutation = useMutation(
    trpc.invoice.updateStatus.mutationOptions({
      onSuccess: () => {
        toast.success("Status updated successfully!", {
          description: "The status of the invoice has been updated successfully.",
        });
        queryClient.invalidateQueries({ queryKey: trpc.invoice.list.queryKey() });
      },
      onError: (error) => {
        toast.error("Failed to update status!", {
          description: parseCatchError(error),
        });
      },
    }),
  );

  const form = useForm<InvoiceStatusSchema>({
    resolver: zodResolver(invoiceStatusSchema),
    defaultValues: {
      id: invoiceId,
      status: currentStatus as (typeof invoiceStatusEnum.enumValues)[number],
    },
  });

  const onSubmit = async (data: InvoiceStatusSchema) => {
    await updateServerInvoiceStatusMutation.mutateAsync({
      id: invoiceId,
      status: data.status,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <PriorityMediumIcon />
          <span>Update Status</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent hideCloseButton>
        <DialogHeaderContainer>
          <DialogHeader>
            <DialogIcon>
              <PriorityMediumIcon />
            </DialogIcon>
            <DialogTitle>Update Invoice Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the status of this invoice? This will change the status of the invoice.
            </DialogDescription>
          </DialogHeader>
        </DialogHeaderContainer>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogContentContainer className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <Label>Invoice ID</Label>
                <Input value={invoiceId} disabled />
              </div>
              <FormSelect reactform={form} name="status" label="Status">
                <SelectItem value="pending">
                  <div className="flex flex-row items-center gap-2">
                    <HourglassStartIcon />
                    <span>Pending</span>
                  </div>
                </SelectItem>
                <SelectItem value="success">
                  <div className="flex flex-row items-center gap-2">
                    <FileCheckIcon />
                    <span>Success</span>
                  </div>
                </SelectItem>
                <SelectItem value="error">
                  <div className="flex flex-row items-center gap-2">
                    <FileBanIcon />
                    <span>Error</span>
                  </div>
                </SelectItem>
                <SelectItem value="expired">
                  <div className="flex flex-row items-center gap-2">
                    <FileAlertIcon />
                    <span>Expired</span>
                  </div>
                </SelectItem>
                <SelectItem value="refunded">
                  <div className="flex flex-row items-center gap-2">
                    <FileRefreshIcon />
                    <span>Refunded</span>
                  </div>
                </SelectItem>
              </FormSelect>
            </DialogContentContainer>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" size="xs">
                  Cancel
                </Button>
              </DialogClose>
              <FormButton disabled={updateServerInvoiceStatusMutation.isPending} variant="default" size="xs">
                Update Status
              </FormButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusModal;
