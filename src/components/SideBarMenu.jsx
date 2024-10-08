import Link from "next/link";
import { ButtonGroupActions } from ".";
import { DashboardIcon, DollarIcon, UsersIcon } from "./icons";

export function SideBarMenu() {
  return (
    <aside className="hidden w-48 bg-white shadow-md lg:block">
      <div className="flex h-full flex-col">
        <ButtonGroupActions />

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
            <UsersIcon />
            <span>Users</span>
          </Link>
          <Link
            href="#"
            className="flex items-center space-x-2 rounded-lg px-2 py-2 text-gray-600 hover:bg-gray-100"
          >
            <DollarIcon />
            <span>Accounting</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
