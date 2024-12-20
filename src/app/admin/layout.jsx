import { Header } from "@/components";
import { FormRegisterUser } from "@/components/auth";
import { PopupFormCreateNewLesson } from "@/components/PopupFormCreateNewLesson/PopupFormCreateNewLesson";

import { SideBarMenu } from "@/components/SideBarMenu";

export const metadata = {
  title: "Gestion de horarios y contabilidad homeclikclass",
  description: "Gestion de horarios y contabilidad homeclikclass ",
};

export default function RootLayout({ children }) {
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
