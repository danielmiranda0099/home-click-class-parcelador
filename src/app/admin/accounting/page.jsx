"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import moment from "moment";

export default function CierreDeCaja() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="w-full flex-grow">
        <div className="w-full flex gap-3 mb-8 justify-end items-end">
          <Link
            href="#"
            className="pb-[0.08rem] border-b-2 border-gray-700 hover:text-blue-500 hover:border-blue-500 hover:bg-gray-200"
          >
            Ver todos los movimientos
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Movimiento</DialogTitle>
                <DialogDescription>
                  Ingrese los detalles del nuevo movimiento aquí.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input id="fecha" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monto">Monto</Label>
                    <Input id="monto" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ventas">Ingreso</SelectItem>
                      <SelectItem value="compras">Egreso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción (opcional)</Label>
                  <Input
                    id="descripcion"
                    placeholder="Ingrese una descripción"
                  />
                </div>
                <div className="flex justify-between">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="button">Guardar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Cartera
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Movimiento de Cartera</DialogTitle>
                <DialogDescription>
                  Ingrese los detalles del movimiento de cartera aquí.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="monto">Monto</Label>
                  <Input id="monto" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectContent>
                        <SelectItem value="ventas">Ingreso</SelectItem>
                        <SelectItem value="compras">Egreso</SelectItem>
                      </SelectContent>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción (opcional)</Label>
                  <Input
                    id="descripcion"
                    placeholder="Ingrese una descripción"
                  />
                </div>
                <div className="flex justify-between">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="button">Guardar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Actuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">$105,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Egresos Actuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">$45,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Balance Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">$60,000</div>
            </CardContent>
          </Card>
        </div>

        <div
          className="flex flex-col md:flex-row gap-3 mb-8 items-start
        "
        >
          <Card className="md:w-[60%] w-full">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Movimientos Actuales</CardTitle>
            </CardHeader>
            <CardContent className="p-2 pb-6">
              <Table>
                <TableHeader className="bg-slate-900">
                  <TableRow className="hover:bg-current">
                    <TableHead className="">Fecha</TableHead>
                    <TableHead className="">Monto</TableHead>

                    <TableHead className="">Concepto</TableHead>
                    <TableHead className=""></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-gray-100 border-2 p-3">
                  <TableRow>
                    <TableCell className="py-0 text-sm min-w-24">
                      {moment().format("DD-MM-YY")}
                    </TableCell>
                    <TableCell className="text-green-600 py-0">
                      $35.000
                    </TableCell>

                    <TableCell className="py-0">Pago estudiante.</TableCell>
                    <TableCell className="py-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Editar movimiento"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Eliminar movimiento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-0 text-sm min-w-24">
                      {moment().format("DD-MM-YY")}
                    </TableCell>
                    <TableCell className="text-green-600 py-0">
                      $35.000
                    </TableCell>

                    <TableCell className="py-0">Pago estudiante.</TableCell>
                    <TableCell className="py-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Editar movimiento"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Eliminar movimiento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-0 text-sm min-w-24">
                      {moment().format("DD-MM-YY")}
                    </TableCell>
                    <TableCell className="text-red-600 py-0">$15.000</TableCell>

                    <TableCell className="py-0">Hojas de block.</TableCell>
                    <TableCell className="py-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Editar movimiento"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Eliminar movimiento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-0 text-sm min-w-24">
                      {moment().format("DD-MM-YY")}
                    </TableCell>
                    <TableCell className="text-red-600 py-0">$15.000</TableCell>

                    <TableCell className="py-0">Pago Profesor.</TableCell>
                    <TableCell className="py-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Editar movimiento"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Eliminar movimiento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-0 text-sm min-w-24">
                      {moment().format("DD-MM-YY")}
                    </TableCell>
                    <TableCell className="text-green-600 py-0">
                      $35.000
                    </TableCell>

                    <TableCell className="py-0">Pago estudiante.</TableCell>
                    <TableCell className="py-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Editar movimiento"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Eliminar movimiento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-0 text-sm min-w-24">
                      {moment().format("DD-MM-YY")}
                    </TableCell>
                    <TableCell className="text-red-600 py-0">$15.000</TableCell>

                    <TableCell className="py-0">Pago profesor.</TableCell>
                    <TableCell className="py-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Editar movimiento"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Eliminar movimiento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="md:w-[40%] w-full">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Cartera</CardTitle>
            </CardHeader>
            <CardContent className="p-2 pb-6">
              <Table>
                <TableHeader className="bg-slate-900">
                  <TableRow className="hover:bg-current">
                    <TableHead className="">Monto</TableHead>

                    <TableHead className="">Concepto</TableHead>
                    <TableHead className=""></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-gray-100 border-2">
                  <TableRow>
                    <TableCell className="text-red-600 py-0">$50,00</TableCell>

                    <TableCell className="py-0">
                      Pendiente pago profesor
                    </TableCell>
                    <TableCell className="py-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Editar movimiento"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Eliminar movimiento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-red-600 py-0">$70,00</TableCell>

                    <TableCell className="py-0">
                      Pagar factura del hosting
                    </TableCell>
                    <TableCell className="py-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Editar movimiento"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Eliminar movimiento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-0 text-green-600">
                      $60,000
                    </TableCell>

                    <TableCell className="py-0">
                      Pendiente pago student
                    </TableCell>
                    <TableCell className="py-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Editar movimiento"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Eliminar movimiento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="border-2 border-gray-100 border-t-0">
                <div className="flex gap-2 justify-start pl-4 py-3 pb-1">
                  <p className="font-medium text-green-600">Total:</p>
                  <p className="font-bold text-green-600">$60,000</p>
                </div>

                <div className="flex gap-2 justify-start pl-4 py-3 pt-0">
                  <p className="font-medium text-red-600">Total:</p>
                  <p className="font-bold text-red-600">$120,000</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
