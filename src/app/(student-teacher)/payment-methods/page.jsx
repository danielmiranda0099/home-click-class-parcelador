import { PaymentMethods } from "@/components/paymentMethods";

export default async function PaymentMethodsPage() {
  return (
    <div className="w-full min-h-[95vh] bg-gray-100 py-2 px-4 sm:px-6 lg:px-8">
      <PaymentMethods />
    </div>
  );
}
