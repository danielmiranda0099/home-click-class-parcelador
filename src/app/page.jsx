import Image from "next/image";
import { FormLogin } from "@/components/auth";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto w-[95%] max-w-sm md:w-[40%] md:max-w-md lg:w-[20%] space-y-6">
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
    </main>
  );
}
