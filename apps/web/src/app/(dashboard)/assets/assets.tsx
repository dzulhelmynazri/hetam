"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ImageSparkleIcon, SignatureIcon, TrashIcon, IdBadgeIcon } from "@/assets/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getImagesWithKey } from "@/lib/manage-assets/getImagesWithKey";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import { LoginModal } from "@/components/layout/auth/login-modal";
import EmptySection from "@/components/ui/icon-placeholder";
import UploadSignatureAsset from "./upload-signature.asset";
import { DefaultDetails } from "./default-details";
import UploadLogoAsset from "./upload-logo-asset";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/client-auth";
import { R2_PUBLIC_URL } from "@/constants";
import { useTRPC } from "@/trpc/client";
import Image from "next/image";
import { toast } from "sonner";
import React from "react";

interface ImageType {
  key: "logo" | "signature";
  icon: React.ReactNode;
  title: "Logos" | "Signatures";
  description: string;
}

const typeOfImages: ImageType[] = [
  {
    key: "logo",
    icon: <ImageSparkleIcon />,
    title: "Logos",
    description: "Manage the logos that will be used in your invoices. Uploaded logos are saved to cloud storage.",
  },
  {
    key: "signature",
    icon: <SignatureIcon />,
    title: "Signatures",
    description:
      "Manage the signatures that will be used in your invoices. Uploaded signatures are saved to cloud storage.",
  },
];

const AssetsPage = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: session, isPending: isSessionPending } = useSession();

  // Fetch images from server
  const images = useQuery({
    ...trpc.cloudflare.listImages.queryOptions(),
    enabled: !!session?.user,
  });

  // Delete image from server
  const deleteServerImageMutation = useMutation(
    trpc.cloudflare.deleteImageFile.mutationOptions({
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGES.TOAST_DEFAULT_TITLE, {
          description: SUCCESS_MESSAGES.IMAGE_DELETED,
        });

        queryClient.invalidateQueries({ queryKey: trpc.cloudflare.listImages.queryKey() });
      },
      onError: (error) => {
        toast.error(ERROR_MESSAGES.TOAST_DEFAULT_TITLE, {
          description: error.message,
        });
      },
    }),
  );

  if (!isSessionPending && !session?.user) {
    return (
      <div className="dash-page flex h-[calc(100svh-120px)] flex-col items-center justify-center gap-4 p-4 text-center">
        <div className="flex max-w-sm flex-col items-center gap-2">
          <h2 className="instrument-serif text-3xl font-semibold">Sign in to manage assets</h2>
          <p className="text-muted-foreground text-sm">
            Log in to manage your default company/client details, logos, and signatures stored in the cloud.
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

  if (images.isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <EmptySection
          title={SUCCESS_MESSAGES.LOADING_ASSETS}
          description={SUCCESS_MESSAGES.LOADING_ASSETS_DESCRIPTION}
        />
      </div>
    );
  }

  if (images.isError) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-red-500">
        <EmptySection
          title={ERROR_MESSAGES.DEFAULT}
          description={`${ERROR_MESSAGES.FETCHING_ASSETS} ${images.failureReason}`}
        />
      </div>
    );
  }

  const handleDeleteImage = (imageId: string) => {
    deleteServerImageMutation.mutate({ key: imageId });
  };

  return (
    <div className="p-4">
      <Accordion
        type="multiple"
        defaultValue={[typeOfImages[0].key, typeOfImages[1].key, "details"]}
        className="w-full divide-y border-b"
      >
        <AccordionItem value="details">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <IdBadgeIcon />
              <span>Default Details</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div>
              <div className="instrument-serif text-xl font-bold">Default Details</div>
              <p className="text-muted-foreground text-xs">
                Save your company and client details once to pre-fill every new invoice. Stored securely on the server.
              </p>
            </div>
            <div className="mt-4">
              <DefaultDetails />
            </div>
          </AccordionContent>
        </AccordionItem>

        {typeOfImages.map((type) => {
          const list = getImagesWithKey(images.data?.images, type.key);

          return (
            <AccordionItem key={type.key} value={type.key}>
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  {type.icon}
                  <span>{type.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <div className="instrument-serif text-xl font-bold">{type.title}</div>
                  <p className="text-muted-foreground text-xs">{type.description}</p>
                </div>
                {/* List Images */}
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                  {type.key === "logo" && <UploadLogoAsset type="server" />}
                  {type.key === "signature" && <UploadSignatureAsset type="server" />}
                  {list.map((image) => (
                    <div key={image} className="bg-border/30 relative rounded-md">
                      <Button
                        disabled={deleteServerImageMutation.isPending}
                        variant="ghost"
                        size="xs"
                        className="absolute right-2 top-2 !px-0.5 text-red-500 hover:!bg-red-500 hover:!text-white"
                        onClick={() => handleDeleteImage(image)}
                      >
                        <TrashIcon />
                      </Button>
                      <Image
                        src={`${R2_PUBLIC_URL}/${image}`}
                        alt={image}
                        width={200}
                        height={200}
                        className="aspect-square w-full rounded-md object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default AssetsPage;
