import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { WompiPayment } from "./WompiPayment";
import { NequiPayment } from "./NequiPayment";
import { BancolombiaPayment } from "./BancolombiaPayment";

export function PaymentMethods() {
  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" asChild>
        <Link href="/classes" className="flex gap-2 pl-0 text-lg">
          <ArrowLeftIcon />
          Volver
        </Link>
      </Button>
      <h1 className="text-3xl font-bold text-left mb-2 text-gray-800">
        Métodos de pago
      </h1>
      <h2 className="mb-8">
        Seleccione el método de pago que desee. Ofrecemos una variedad de
        opciones de pago, paga de forma segura y sin complicaciones.
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <WompiPayment />
        <NequiPayment />
        <BancolombiaPayment />
      </div>
    </div>
  );
}
