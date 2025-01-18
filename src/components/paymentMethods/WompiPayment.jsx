import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeModal } from "./QRCodeModal";

export function WompiPayment() {
  return (
    <Card className="relative z-10  overflow-hidden border p-[1px]">
      <div class="animate-rotate absolute inset-0 h-full w-full rounded-full bg-[conic-gradient(#0ea5e9_20deg,transparent_120deg)]"></div>
      <div class="relative z-20 bg-white rounded-[0.3rem] h-full">
        <CardHeader>
          <CardTitle className="">
            <Image
              src={"/wompi_logo.png"}
              width={80}
              height={30}
              className="mx-auto mb-3"
              alt="logo wompi"
            />

            <p className="text-base">
              Para pagos <span className="underline">internacionales</span> y
              nacionales.
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" asChild>
            <a
              href="https://checkout.wompi.co/l/P1zjV1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Paga Con Wompi
            </a>
          </Button>
          <QRCodeModal image_QR="wompi_qr.jpeg" title="Wompi" />
        </CardContent>
      </div>
    </Card>
  );
}
