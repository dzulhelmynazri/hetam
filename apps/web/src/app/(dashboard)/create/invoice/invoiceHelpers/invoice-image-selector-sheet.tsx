"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import UploadSignatureAsset from "@/app/(dashboard)/assets/upload-signature.asset";
import UploadLogoAsset from "@/app/(dashboard)/assets/upload-logo-asset";
import { getImagesWithKey } from "@/lib/manage-assets/getImagesWithKey";
import EmptySection from "@/components/ui/icon-placeholder";
import { InvoiceImageType } from "@/types/common/invoice";
import { R2_PUBLIC_URL } from "@/constants";
import { AuthUser } from "@/types/auth";
import { useState } from "react";
import Image from "next/image";

interface InvoiceImageSelectorSheetProps {
  children: React.ReactNode;
  type: InvoiceImageType;
  isLoading?: boolean;
  serverImages: string[];
  user: AuthUser | undefined;
  onUrlChange: (url: string) => void;
  onBase64Change?: (base64?: string) => void;
}

export const InvoiceImageSelectorSheet = ({
  children,
  type,
  isLoading = false,
  serverImages,
  user,
  onUrlChange,
}: InvoiceImageSelectorSheetProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleImageSelect = (image: string) => {
    onUrlChange(`${R2_PUBLIC_URL}/${image}`);
    setSheetOpen(false);
  };

  const imagesList = getImagesWithKey(serverImages, type);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="scroll-bar-hidden w-[90%] !max-w-lg overflow-y-scroll">
        <SheetHeader className="hidden flex-col gap-0">
          <SheetTitle>Select {type}</SheetTitle>
          <SheetDescription>Select an image from your assets</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center p-8">
            <EmptySection title="Loading..." description="Please wait while we load the images." />
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-4">
              <div>
                <div className="instrument-serif text-xl font-bold">Select {type}</div>
                <p className="text-muted-foreground text-xs">
                  Choose a {type} from your cloud assets or upload a new one.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {user && type === "logo" && <UploadLogoAsset disableIcon type="server" />}
                {user && type === "signature" && <UploadSignatureAsset disableIcon type="server" />}
                {imagesList.map((image) => (
                  <div
                    key={image}
                    className="bg-border/30 relative cursor-pointer rounded-md"
                    onClick={() => handleImageSelect(image)}
                  >
                    <Image
                      src={`${R2_PUBLIC_URL}/${image}`}
                      alt={image}
                      width={200}
                      height={200}
                      className="aspect-square w-full rounded-md border object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
