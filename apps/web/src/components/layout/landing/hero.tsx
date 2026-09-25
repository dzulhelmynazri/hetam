"use client";

import { CircleOpenArrowRight } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { LINKS } from "@/constants/links";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <div className="relative flex flex-1 flex-row items-center overflow-hidden border-b border-dashed">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Image
          className="h-full min-h-full w-full object-cover object-left invert dark:invert-0"
          src="/official/hetam-masked-background.png"
          alt="Hero"
          width={1920}
          height={1080}
          priority
        />
      </div>
      <div className="z-10 flex flex-col gap-4">
        <div className="instrument-serif flex flex-col gap-2 px-6 text-6xl">
          <h1 className="dark:text-primary-foreground/30 text-secondary-foreground/50">
            Welcome to{" "}
            <span className="dark:text-primary-foreground text-secondary-foreground">hetam&apos;s Family</span> &lt;3
          </h1>
        </div>
        <div className="mt-4 flex flex-row gap-4 px-6">
          <Link href={LINKS.CREATE.INVOICE}>
            <Button>
              <span>Get Started</span>
              <CircleOpenArrowRight className="-rotate-45" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
