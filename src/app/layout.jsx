import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getIsActiveUser } from "@/actions/CrudUser";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gestion de horarios y contabilidad homeclikclass  App",
  description: "Gestion de horarios y contabilidad homeclikclass ",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  if (session?.user) {
    const response = await getIsActiveUser(session.user.id);
    if (response.success && !response.data.isActive) {
      redirect("/api/auth/logout");
    }
  }

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logohomeclick-32x32.png" sizes="32x32" />
        <link rel="icon" href="/logohomeclick-180x180.png" sizes="192x192" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
