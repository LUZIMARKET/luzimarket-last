"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { HandpickedMark } from "@/components/ui/handpicked-mark";
import { useTranslations } from "next-intl";

export function HeroSplit() {
  const t = useTranslations("HomePage");

  return (
    <div className="w-full h-auto md:h-[60vh] min-h-[500px] flex flex-col md:flex-row relative">
      <div className="w-full md:w-1/2 h-[50vh] md:h-full relative bg-gray-100">
        <Image
          src="https://images.unsplash.com/photo-1582046467389-980072b21cf5?q=80&w=1500&auto=format&fit=crop"
          alt="Apartamento Tote Bag"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 h-[50vh] md:h-full flex flex-col items-center justify-center p-8 bg-white text-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl text-gray-900 font-serif font-times-now mb-6 leading-tight max-w-xl mx-auto">
          Regalos <HandpickedMark>handpicked</HandpickedMark><br/> extraordinarios
        </h1>
        <p className="text-sm md:text-base text-gray-600 font-sans max-w-md mx-auto mb-8 font-light">
          Experiencias y productos seleccionados a mano para momentos especiales.
        </p>
        <Link href="/handpicked">
          <Button className="bg-black text-white hover:bg-gray-800 rounded-none px-12 py-6 text-xs font-sans tracking-widest uppercase transition-all duration-300">
            {t("viewHandpicked")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
