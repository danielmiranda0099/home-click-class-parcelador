"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function ButtonSignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 cursor-pointer"
    >
      <div className="h-4 w-4" />
      <span>Cerrar sesión</span>
    </button>
  );
}
