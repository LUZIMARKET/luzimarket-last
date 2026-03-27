"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useTranslations } from 'next-intl';

interface SearchResult {
  id: string;
  name: string;
  slug?: string;
  price?: string;
  image?: string;
  type: "product" | "category" | "vendor";
}

interface FullWidthSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullWidthSearch({ isOpen, onClose }: FullWidthSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Common');

  const debouncedQuery = useDebounce(query, 300);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="w-full bg-white relative z-[60]">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-12 flex flex-col">
        <form onSubmit={handleSubmit} className="pt-8">
          <div className="flex items-center pb-3 border-b border-gray-300">
            <Search className="h-5 w-5 text-black mr-6 shrink-0" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos"
              className="flex-1 text-2xl font-sans text-gray-500 placeholder:text-gray-300 outline-none border-none bg-transparent"
            />
            {query.length > 0 && (
              <button 
                  type="button" 
                  onClick={clearSearch}
                  aria-label="Clear Search"
                  className="ml-4 mr-6 text-gray-400 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            )}
            <button 
                type="button" 
                onClick={onClose}
                aria-label="Close Search"
                className="text-gray-400 hover:text-black transition-colors"
            >
              <X className="h-6 w-6" strokeWidth={1} />
            </button>
          </div>
        </form>
        
        {/* Results Area */}
        <div className="w-full">
          {isLoading ? (
            <div className="py-8 text-gray-400 font-sans tracking-wide">
              Buscando...
            </div>
          ) : results.length > 0 ? (
            <div className="py-6 flex flex-col gap-3 border-b border-gray-300">
              {results.slice(0, 8).map((result) => (
                <Link
                  key={result.id}
                  href={`/products/${result.slug || result.id}`}
                  onClick={() => { onClose(); setQuery(''); }}
                  className="text-[17px] text-gray-600 hover:text-black font-sans transition-colors block w-fit"
                >
                  {result.name}
                </Link>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="py-8 text-gray-400 font-sans tracking-wide border-b border-gray-300">
              No se encontraron resultados para &quot;{query}&quot;.
            </div>
          ) : (
            <div className="h-8"></div>
          )}
        </div>
      </div>
    </div>
  );
}
