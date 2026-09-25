"use client";

import ThemeSwitch from "@/components/table-columns/theme-switch";
import { LoginModal } from "@/components/layout/auth/login-modal";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/client-auth";
import { CircleOpenArrowRight } from "@/icons";
import { useMounted } from "@mantine/hooks";
import { LINKS } from "@/constants/links";
import Link from "next/link";
import React from "react";

const Header = () => {
  const isMounted = useMounted();
  const session = useSession();

  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-dashed px-4">
      <Link className="flex flex-row items-center gap-2" href={LINKS.HOME}>
        <span className="instrument-serif text-xl font-semibold">hetam</span>
      </Link>
      <div className="flex flex-row items-center gap-3">
        <ThemeSwitch />
        {isMounted && session.data ? (
          <Link href={LINKS.DASHBOARD}>
            <Button variant="secondary">
              <span>Dashboard</span>
              <CircleOpenArrowRight className="text-muted-foreground -rotate-45" />
            </Button>
          </Link>
        ) : (
          <LoginModal
            callbackURL={LINKS.DASHBOARD}
            trigger={
              <Button variant="secondary">
                <span>Login</span>
                <CircleOpenArrowRight className="text-muted-foreground -rotate-45" />
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default Header;
