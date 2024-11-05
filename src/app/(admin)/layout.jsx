import { Header } from "@/components";
import { FormRegisterUser } from "@/components/auth";
import { FormCreateNewLesson } from "@/components/formCreateNewLesson";
import { SideBarMenu } from "@/components/SideBarMenu";

export const metadata = {
  title: "Plataforma para estudiantes y profesores",
  description: "Generated by create next app",
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
          <FormCreateNewLesson />
          <main className="p-2">{children}</main>
        </div>
      </div>
    </>
  );
}
