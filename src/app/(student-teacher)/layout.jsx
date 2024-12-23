import { auth } from "@/auth";
import { Header } from "@/components";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Gestion de horarios y contabilidad homeclikclass",
  description: "Gestion de horarios y contabilidad homeclikclass ",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  if (!session || (session?.user?.role[0] !== "student" && session?.user?.role[0] !== "teacher")) {
    redirect("/api/auth/logout");
  }

  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
