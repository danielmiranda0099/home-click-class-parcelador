"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilIcon, TrashIcon } from "@/components/icons";

export function TableDebt() {
  return (
    <>
      <Card className="md:w-[40%] w-full">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Cartera</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between min-h-[25rem] p-2 pb-6 gap-3">
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

                <TableCell className="py-0">Pendiente pago profesor</TableCell>
                <TableCell className="py-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Editar movimiento"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Eliminar movimiento"
                  >
                    <TrashIcon className="h-4 w-4" />
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
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Eliminar movimiento"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-0 text-green-600">$60,000</TableCell>

                <TableCell className="py-0">Pendiente pago student</TableCell>
                <TableCell className="py-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Editar movimiento"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Eliminar movimiento"
                  >
                    <TrashIcon className="h-4 w-4" />
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
    </>
  );
}
