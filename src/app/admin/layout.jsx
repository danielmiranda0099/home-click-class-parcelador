import { auth } from "@/auth";
import { Header } from "@/components";
import { FormRegisterUser } from "@/components/auth";
import { PopupFormCreateNewLesson } from "@/components/PopupFormCreateNewLesson/PopupFormCreateNewLesson";

import { SideBarMenu } from "@/components/SideBarMenu";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Gestion de horarios y contabilidad homeclikclass",
  description: "Gestion de horarios y contabilidad homeclikclass ",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  if (!session || session?.user?.role[0] !== "admin") {
    redirect("/api/auth/logout");
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        {/* Sidebar */}

        <SideBarMenu />
        {/* Main Content */}
        <div className="w-full">
          {/* Page Content */}
          <FormRegisterUser />
          <PopupFormCreateNewLesson />
          <main className="p-2 relative">{children}</main>
        </div>
      </div>
    </>
  );
}
