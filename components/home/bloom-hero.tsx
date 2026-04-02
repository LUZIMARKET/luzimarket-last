"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function BloomHero() {
  return (
    <div className="w-full h-auto min-h-[50vh] md:h-[70vh] relative flex items-center justify-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=1920&auto=format&fit=crop"
        alt="Bloom, baby, bloom"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/5" />
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-serif mb-8 drop-shadow-sm font-times-now">
          Bloom, baby, bloom.
        </h1>
        <Link href={{ pathname: '/category/[slug]', params: { slug: 'flores-arreglos' } }}>
          <Button className="bg-white text-gray-900 border border-white hover:bg-transparent hover:text-white rounded-none px-10 py-6 text-xs font-sans tracking-widest uppercase transition-all duration-300 shadow-xl">
            Flowershop
          </Button>
        </Link>
      </div>
    </div>
  );
}
