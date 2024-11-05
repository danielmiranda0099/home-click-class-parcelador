"use client";
import { signOut } from "next-auth/react";

export function ButtonSignOut() {
  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => signOut()}
    >
      <div className="h-4 w-4" />
      <span>Cerrar sesión</span>
    </div>
  );
}
