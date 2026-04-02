"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PromoBanner() {
  const t = useTranslations("HomePage");
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(formData: FormData) {
    setLoading(true);
    const res = await subscribeToNewsletter(formData);
    setLoading(false);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(t("subscribeSuccess"));
      formRef.current?.reset();
      setOpen(false);
    }
  }

  return (
    <div className="w-full bg-gradient-to-r from-[#FF8A00] to-[#FFD700] py-4 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between text-gray-900">
      <div className="flex-1 flex justify-center sm:justify-start mb-3 sm:mb-0">
        <p className="font-sans font-medium text-sm sm:text-base tracking-wide text-center sm:text-left">
          {t("promoBannerTitle")}
        </p>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 rounded-none px-8 py-2 text-xs font-sans tracking-wide transition-colors shadow-sm">
            {t("subscribeButton")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              10% Off
            </DialogTitle>
            <DialogDescription>
              {t("promoBannerTitle")}
            </DialogDescription>
          </DialogHeader>
          <form 
            ref={formRef}
            action={handleSubscribe} 
            className="flex flex-col gap-4 mt-2"
          >
            <input 
              type="email" 
              name="email"
              placeholder={t("subscribeEmailPlaceholder")} 
              required
              className="w-full px-4 py-2 text-sm border focus:outline-none focus:ring-1 focus:ring-gray-900 text-gray-900 transition-all rounded-none"
            />
            <Button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-800 rounded-none px-8 py-2 text-xs font-sans tracking-wide uppercase transition-colors"
            >
              {loading ? "..." : t("subscribeButton")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
