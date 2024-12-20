import Image from "next/image";
import { FormLogin } from "@/components/auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    if (
      session.user.role.includes("student") ||
      session.user.role.includes("teacher")
    ) {
      redirect("/classes");
    }
    if (session.user.role.includes("admin")) {
      redirect("/admin/dashboard");
    }
  }

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
          <p className="text-muted-foreground">Estado de cuenta y horarios</p>
        </div>
        <FormLogin />
      </div>
    </main>
  );
}
