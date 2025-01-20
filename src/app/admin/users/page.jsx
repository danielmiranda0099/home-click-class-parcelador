"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";

export default function UsersPage() {
  const { users, setUsers } = useUserStore();
  const [search_user, setSearchUser] = useState("");
  const [filter_users, setFilterUsers] = useState(users);

  //TODO: Pasar a custonHook que tenga el useEffect()
  useEffect(() => {
    if (users.length < 1 || !users) {
      setUsers();
    }
  }, []);

  useEffect(() => {
    setFilterUsers(users);
  }, [users]);

  useEffect(() => {
    const filter_users = users?.filter(
      (user) =>
        user.fullName.toLowerCase().includes(search_user.toLowerCase()) ||
        user.email.toLowerCase().includes(search_user.toLowerCase()) ||
        user.role.some((role) => role.includes(search_user.toLowerCase()))
    );
    setFilterUsers(filter_users);
  }, [search_user]);

  return (
    <div className="container mx-auto p-0 sm:p-4 max-w-[1200px]">
      <h1 className="text-2xl font-bold mb-4">Buscador de Usuarios</h1>
      <Input
        type="text"
        placeholder="Buscar usuarios..."
        value={search_user}
        onChange={(e) => setSearchUser(e.target.value)}
        className="mb-4"
      />
      <Table className="border-gray-400 border-2 mx-auto w-full">
        <TableHeader className="bg-slate-900">
          <TableRow className="hover:bg-current">
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            {/* <TableHead>Activo</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filter_users?.map((user, index) => (
            <TableRow
              key={user.id}
              className={`${index % 2 === 0 && "bg-slate-100"} hover:bg-sky-100`}
            >
              <TableCell className="min-w-56 text-xs sm:text-sm">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="hover:underline"
                >
                  {user.fullName}
                </Link>
              </TableCell>
              <TableCell className="text-xs sm:text-sm">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="hover:underline"
                >
                  {user.email}
                </Link>
              </TableCell >
              <TableCell className="text-xs sm:text-sm">{user.role}</TableCell>
              {/* <TableCell>{user.activo ? "Sí" : "No"}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
