import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function QRCodeModal({ image_QR = null, title = "" }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Ver Código QR
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title} Codigo QR</DialogTitle>
        </DialogHeader>
        <div className="w-64 h-64 mx-auto bg-gray-200 flex items-center justify-center">
          {image_QR && (
            <Image
              src={`/${image_QR}`}
              width={500}
              height={500}
              alt="codigo qr"
              className="w-full"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
