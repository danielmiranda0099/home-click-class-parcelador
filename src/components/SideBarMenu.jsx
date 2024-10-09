import Link from "next/link";
import { ButtonGroupActions } from ".";
import { DashboardIcon, DollarIcon, UsersIcon } from "./icons";

export function SideBarMenu() {
  return (
    <aside className="hidden md:block w-48 shadow-md relative">
      <div className="md:sticky md:top-0">
        <div className="flex flex-col">
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
      </div>
    </aside>
  );
}
