"use client";

import {
  Dialog,
  DialogContent,
  DialogContentContainer,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { clientAuth } from "@/lib/client-auth";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";

interface LoginModalProps {
  children?: React.ReactNode;
  callbackURL?: string;
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
}

export function LoginModal({ children, callbackURL, trigger, defaultOpen = false }: LoginModalProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleLogin = () => {
    setIsDisabled(true);

    clientAuth.signIn.social({
      provider: "google",
      callbackURL: callbackURL || pathname,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || children || (
          <Button className="mt-2.5 w-fit" variant="default" size="xs">
            Login
          </Button>
        )}
      </DialogTrigger>
      <DialogContent hideCloseButton>
        <DialogContentContainer className="flex items-center py-6 text-center">
          <div>
            <DialogTitle className="instrument-serif text-3xl font-semibold">Welcome back!</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Login with your google account to continue
            </DialogDescription>
          </div>
          <button disabled={isDisabled} className="mt-2 cursor-pointer" onClick={handleLogin}>
            <Image
              className="dark:hidden"
              src="/social/google-login-btn-light.svg"
              alt="Google Login"
              width={200}
              height={40}
              priority
            />
            <Image
              className="hidden dark:block"
              src="/social/google-login-btn-dark.svg"
              alt="Google Login"
              width={200}
              height={40}
              priority
            />
          </button>
        </DialogContentContainer>
      </DialogContent>
    </Dialog>
  );
}
