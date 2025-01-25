"use client";
import { useState } from "react";
import Link from "next/link";
import { ButtonGroupActions } from ".";
import {
  BookOpenCheckIcon,
  DashboardIcon,
  DollarIcon,
  MenuIcon,
  UsersIcon,
} from "./icons";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export function SideBarMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const path_name = usePathname();

  const handleCloseMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Botón para abrir el menú en móvil */}
      <Button
        onClick={() => setIsMenuOpen(true)}
        className={`${isMenuOpen && "hidden"} md:hidden p-2 fixed bottom-4 left-4 rounded-full shadow-lg z-50`}
      >
        <MenuIcon />
      </Button>

      {/* Menú lateral */}
      <aside
        className={`fixed inset-y-0 left-0 w-48 bg-white shadow-md transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:relative md:translate-x-0 z-40`}
      >
        <div className="md:sticky md:top-0">
          <div className="flex flex-col">
            {/* Botón para cerrar el menú en móvil */}
            <button
              onClick={handleCloseMenu}
              className="md:hidden p-2 self-end mr-2 mt-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <ButtonGroupActions />

            <nav className="space-y-2 p-4">
              <Link
                href="/admin/dashboard"
                className={`flex items-center space-x-2 px-2 py-1 text-gray-600 hover:bg-gray-100 ${
                  path_name.includes("/admin/dashboard") &&
                  "font-bold bg-blue-50 text-blue-500 border-b-4 border-blue-500"
                }`}
                onClick={handleCloseMenu}
              >
                <DashboardIcon
                  color={`${
                    path_name.includes("/admin/dashboard")
                      ? "#3b82f6"
                      : "currentColor"
                  }`}
                />
                <span
                  className={`${
                    path_name.includes("/admin/dashboard") && "text-blue-500"
                  }`}
                >
                  Dashboard
                </span>
              </Link>
              <Link
                href="/admin/classes"
                className={`flex items-center space-x-2 px-2 py-1 text-gray-600 hover:bg-gray-100 ${
                  path_name.includes("/admin/classes") &&
                  "font-bold bg-blue-50 text-blue-500 border-b-4 border-blue-500"
                }`}
                onClick={handleCloseMenu}
              >
                <BookOpenCheckIcon
                  color={`${
                    path_name.includes("/admin/classes")
                      ? "#3b82f6"
                      : "currentColor"
                  }`}
                />
                <span
                  className={`${
                    path_name.includes("/admin/classes") && "text-blue-500"
                  }`}
                >
                  Classes
                </span>
              </Link>
              <Link
                href="/admin/users"
                className={`flex items-center space-x-2 px-2 py-1 text-gray-600 hover:bg-gray-100 ${
                  path_name.includes("/admin/users") &&
                  "font-bold bg-blue-50 text-blue-500 border-b-4 border-blue-500"
                }`}
                onClick={handleCloseMenu}
              >
                <UsersIcon
                  color={`${
                    path_name.includes("/admin/users")
                      ? "#3b82f6"
                      : "currentColor"
                  }`}
                />
                <span
                  className={`${
                    path_name.includes("/admin/users") && "text-blue-500"
                  }`}
                >
                  Users
                </span>
              </Link>
              <Link
                href="/admin/accounting"
                className={`flex items-center space-x-2 px-2 py-1 text-gray-600 hover:bg-gray-100 ${
                  path_name.includes("/admin/accounting") &&
                  "font-bold bg-blue-50 text-blue-500 border-b-4 border-blue-500"
                }`}
                onClick={handleCloseMenu}
              >
                <DollarIcon
                  color={`${
                    path_name.includes("/admin/accounting")
                      ? "#3b82f6"
                      : "currentColor"
                  }`}
                />
                <span
                  className={`${
                    path_name.includes("/admin/accounting") && "text-blue-500"
                  }`}
                >
                  Accounting
                </span>
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      {/* Fondo oscuro cuando el menú está abierto en móvil */}
      {isMenuOpen && (
        <div
          onClick={handleCloseMenu}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        />
      )}
    </>
  );
}
