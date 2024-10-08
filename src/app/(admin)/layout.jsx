import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ButtonGroupActions,
  FormNewLesson,
  FormNewUser,
  Header,
} from "@/components";
export const metadata = {
  title: "Plataforma para estudiantes y profesores",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="hidden w-48 bg-white shadow-md lg:block">
          <div className="flex h-full flex-col">
            <ButtonGroupActions />

            <ScrollArea className="flex-1">
              <nav className="space-y-2 p-4">
                <Link
                  href="#"
                  className="flex items-center space-x-2 rounded-lg px-2 py-2 text-gray-600 hover:bg-gray-100"
                >
                  <DashboardIcon />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center space-x-2 rounded-lg px-2 py-2 text-gray-600 hover:bg-gray-100"
                >
                  <TeachersIcon />
                  <span>Teachers</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center space-x-2 rounded-lg px-2 py-2 text-gray-600 hover:bg-gray-100"
                >
                  <StudentsIcon />
                  <span>Students</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center space-x-2 rounded-lg px-2 py-2 text-gray-600 hover:bg-gray-100"
                >
                  <AccountingIcon />
                  <span>Accounting</span>
                </Link>
              </nav>
            </ScrollArea>
          </div>
        </aside>

        {/* Main Content */}
        <div className="w-full">
          {/* Page Content */}
          <FormNewUser />
          <FormNewLesson />
          <main className="p-2">{children}</main>
        </div>
      </div>
    </>
  );
}

const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const TeachersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const StudentsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const AccountingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
