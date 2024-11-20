"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { DollarIcon, XIcon } from "@/components/icons";
import { useState } from "react";

export function PopupImagePay() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="relative p-2 flex gap-1 rounded-full text-white bg-green-500 font-semibold">
          <span className="animate-ping absolute inset-0 m-auto rounded-full inline-flex h-[65%] w-[65%] bg-green-400 opacity-70"></span>
          <DollarIcon />
          Paga Aquí
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-full max-h-screen p-0 overflow-hidden bg-transparent">
        <div className="relative w-full h-screen">
          <Image
            width={1000}
            height={1500}
            src="/image-pay.png"
            className="absolute inset-0 w-full h-full object-contain"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <span className="sr-only">Cerrar</span>
            <XIcon />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
