"use client";

import Header from "@/components/layout/landing/header";
import Hero from "@/components/layout/landing/hero";

export default function Home() {
  return (
    <div className="new-container relative h-svh !border-none sm:!border-dashed">
      <Header />
      <Hero />
    </div>
  );
}
