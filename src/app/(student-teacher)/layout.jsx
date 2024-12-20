import { Header } from "@/components";

export const metadata = {
  title: "Gestion de horarios y contabilidad homeclikclass",
  description: "Gestion de horarios y contabilidad homeclikclass ",
};

export default function RootLayout({ children }) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
