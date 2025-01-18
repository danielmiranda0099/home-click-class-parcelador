import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonCopyToClipboard } from "./ButtonCopyToClipboard";
import { QRCodeModal } from "./QRCodeModal";

export function NequiPayment() {
  const nequiNumber = "+57 3024692289";

  return (
    <Card className="relative z-10  overflow-hidden border p-[1px]">
      <div class="animate-rotate absolute inset-0 h-full w-full rounded-full bg-[conic-gradient(#67bfe7_20deg,transparent_120deg)]"></div>
      <div class="relative z-20 bg-white rounded-[0.3rem] h-full">
        <CardHeader>
          <CardTitle className="">
            <Image
              src={"/nequi-logo.png"}
              width={100}
              height={50}
              className="mx-auto mb-3"
              alt="logo nequi"
            />
            <p className="text-base">
              Paga vía nequi al número o por código QR.
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <p className="text-xl font-semibold">{nequiNumber}</p>
            <ButtonCopyToClipboard to_copy={nequiNumber} />
          </div>
          <QRCodeModal image_QR="nequi-qr.jpeg" title="Nequi" />
        </CardContent>
      </div>
    </Card>
  );
}
