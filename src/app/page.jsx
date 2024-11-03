import Image from "next/image";
import { FormLogin } from "@/components/auth";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <Image
              alt="logo home click class"
              src="/logo.png"
              width={150}
              height={150}
            />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Home Click Class
            </h1>
            <p className="text-muted-foreground">Welcome to our platform</p>
          </div>
          <FormLogin />
        </div>
      </div>
    </main>
  );
}
