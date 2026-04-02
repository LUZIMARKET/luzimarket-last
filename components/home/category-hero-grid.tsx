"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

const categories = [
  {
    title: "Flowershop",
    image: "https://images.unsplash.com/photo-1572454591674-2739f30d8c40?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
    slug: "flores-arreglos",
  },
  {
    title: "Sweet",
    image: "https://images.unsplash.com/photo-1610450949065-1f2841536c88?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
    slug: "chocolates-dulces",
  },
  {
    title: "Beauty + Wellness",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
    slug: "velas-aromas",
  },
  {
    title: "Giftshop",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
    slug: "regalos-personalizados",
  }
];

export function CategoryHeroGrid() {
  return (
    <div className="w-full h-auto min-h-[50vh] md:h-[60vh] grid grid-cols-2 md:grid-cols-4 relative">
      {categories.map((category) => (
        <div key={category.slug} className="relative w-full h-[30vh] md:h-full group overflow-hidden cursor-pointer">
          <Link href={{ pathname: '/category/[slug]', params: { slug: category.slug } }} className="absolute inset-0 z-20">
            <span className="sr-only">Go to {category.title}</span>
          </Link>
          <Image 
            src={category.image}
            alt={category.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/0 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-8 flex justify-center px-4 pointer-events-none z-10">
            <div className="w-full max-w-[200px]">
              <Button className="w-full bg-white text-gray-900 border border-white hover:bg-transparent hover:text-white rounded-none py-6 text-xs font-sans tracking-widest transition-all duration-300 shadow-xl pointer-events-auto">
                {category.title}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
