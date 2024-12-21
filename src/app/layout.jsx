import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gestion de horarios y contabilidad homeclikclass  App",
  description: "Gestion de horarios y contabilidad homeclikclass ",
};

export default function RootLayout({ children }) {
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
