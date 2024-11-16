"use client";
import Link from "next/link";
import { ButtonGroupActions } from ".";
import {
  BookOpenCheckIcon,
  DashboardIcon,
  DollarIcon,
  UsersIcon,
} from "./icons";
import { usePathname } from "next/navigation";

export function SideBarMenu() {
  const path_name = usePathname();
  return (
    <aside className="hidden md:block w-48 shadow-md relative">
      <div className="md:sticky md:top-0">
        <div className="flex flex-col">
          <ButtonGroupActions />

          <nav className="space-y-2 p-4">
            <Link
              href="/admin/dashboard"
              className={`flex items-center space-x-2 px-2 py-1 text-gray-600 hover:bg-gray-100 ${path_name === "/admin/dashboard" && "font-bold bg-blue-50 text-blue-500 border-b-4 border-blue-500"}`}
            >
              <DashboardIcon
                color={`${path_name === "/admin/dashboard" ? "#3b82f6" : "currentColor"}`}
              />
              <span
                className={`${path_name === "/admin/dashboard" && "text-blue-500"}`}
              >
                Dashboard
              </span>
            </Link>
            <Link
              href="/admin/classes"
              className={`flex items-center space-x-2 px-2 py-1 text-gray-600 hover:bg-gray-100 ${path_name === "/admin/classes" && "font-bold bg-blue-50 text-blue-500 border-b-4 border-blue-500"}`}
            >
              <BookOpenCheckIcon
                color={`${path_name === "/admin/classes" ? "#3b82f6" : "currentColor"}`}
              />
              <span
                className={`${path_name === "/admin/classes" && "text-blue-500"}`}
              >
                Classes
              </span>
            </Link>
            <Link
              href="/admin/users"
              className={`flex items-center space-x-2 px-2 py-1 text-gray-600 hover:bg-gray-100 ${path_name === "/admin/users" && "font-bold bg-blue-50 text-blue-500 border-b-4 border-blue-500"}`}
            >
              <UsersIcon
                color={`${path_name === "/admin/users" ? "#3b82f6" : "currentColor"}`}
              />
              <span
                className={`${path_name === "/admin/users" && "text-blue-500"}`}
              >
                Users
              </span>
            </Link>
            <Link
              href="/admin/accounting"
              className={`flex items-center space-x-2 px-2 py-1 text-gray-600 hover:bg-gray-100 ${path_name === "/admin/accounting" && "font-bold bg-blue-50 text-blue-500 border-b-4 border-blue-500"}`}
            >
              <DollarIcon
                color={`${path_name === "/admin/accounting" ? "#3b82f6" : "currentColor"}`}
              />
              <span
                className={`${path_name === "/admin/accounting" && "text-blue-500"}`}
              >
                Accounting
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
}
