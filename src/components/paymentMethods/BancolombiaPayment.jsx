import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonCopyToClipboard } from "./ButtonCopyToClipboard";
import { QRCodeModal } from "./QRCodeModal";

export function BancolombiaPayment() {
  const accountNumber = "550-638980-14";

  return (
    <Card className="relative z-10  overflow-hidden border p-[1px]">
      <div class="animate-rotate absolute inset-0 h-full w-full rounded-full bg-[conic-gradient(#0ea5e9_20deg,transparent_120deg)]"></div>
      <div class="relative z-20 bg-white rounded-[0.3rem] h-full">
        <CardHeader>
          <CardTitle className="">
            <Image
              src={"/logo-bancolombia.png"}
              width={160}
              height={50}
              className="mx-auto mb-3"
              alt="logo bancolombia"
            />

            <p className="text-base">Transfiere a cuenta bancolombia.</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <p className="text-xl font-semibold">{accountNumber}</p>
            <ButtonCopyToClipboard to_copy={accountNumber} />
          </div>
          <QRCodeModal image_QR="bancolombia-qr.png" title="Bancolombia" />
        </CardContent>
      </div>
    </Card>
  );
}
