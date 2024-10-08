import { Header } from "@/components";

export const metadata = {
  title: "Plataforma para estudiantes y profesores",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
