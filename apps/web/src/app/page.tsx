"use client";

import Header from "@/components/layout/landing/header";
import Hero from "@/components/layout/landing/hero";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="new-container relative h-svh !border-none sm:!border-dashed">
      <Suspense>
        <Header />
      </Suspense>
      <Hero />
    </div>
  );
}
