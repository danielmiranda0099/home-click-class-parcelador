"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const usuarios = [
  {
    id: 1,
    nombre: "Juan Pérez",
    correo: "juan@example.com",
    role: "student",
    activo: true,
  },
  {
    id: 2,
    nombre: "María García",
    correo: "maria@example.com",
    role: "teacher",
    activo: true,
  },
  {
    id: 3,
    nombre: "Carlos Rodríguez",
    correo: "carlos@example.com",
    role: "admin",
    activo: false,
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    correo: "ana@example.com",
    role: "student",
    activo: true,
  },
  {
    id: 5,
    nombre: "Pedro Sánchez",
    correo: "pedro@example.com",
    role: "teacher",
    activo: false,
  },
];

export default function UsersPage() {
  const [busqueda, setBusqueda] = useState("");

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.role.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 max-w-[1200px]">
      <h1 className="text-2xl font-bold mb-4">Buscador de Usuarios</h1>
      <Input
        type="text"
        placeholder="Buscar usuarios..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-4"
      />
      <Table className="border-gray-400 border-2 mx-auto w-full">
        <TableHeader className="bg-slate-900">
          <TableRow className="hover:bg-current">
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Activo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuariosFiltrados.map((usuario, index) => (
            <TableRow
              key={usuario.id}
              className={`${index % 2 === 0 && "bg-slate-100"} hover:bg-sky-100`}
            >
              <TableCell>{usuario.nombre}</TableCell>
              <TableCell>{usuario.correo}</TableCell>
              <TableCell>{usuario.role}</TableCell>
              <TableCell>{usuario.activo ? "Sí" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
