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
import { PencilIcon, SearchIcon, TrashIcon } from "@/components/icons";
import { formatCurrency } from "@/utils/formatCurrency";
import { useState } from "react";

export function TableDebt({ debts }) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 15;

  // Calcular los elementos visibles según la página actual
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleDebts = debts?.slice(startIndex, endIndex);

  const total_income = debts?.reduce(
    (accu, current) =>
      current.type === "income" ? accu + current.amount : accu + 0,
    0
  );

  const total_expense = debts?.reduce(
    (accu, current) =>
      current.type === "expense" ? accu + current.amount : accu + 0,
    0
  );

  const total_balance = total_income - total_expense;

  return (
    <>
      <Card className="md:w-[40%] w-full">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Cartera</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between min-h-[25rem] max-h-[40rem] p-2 pb-6 gap-3">
          {debts?.length > 0 ? (
            <>
              <Table className="relative">
                <TableHeader className="bg-slate-900 sticky top-0">
                  <TableRow className="hover:bg-current">
                    <TableHead className="">Monto</TableHead>
                    <TableHead className="">Concepto</TableHead>
                    <TableHead className=""></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-gray-100 border-2 max-h-[40rem] overflow-y-scroll">
                  {visibleDebts?.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell
                        className={`py-0 ${debt.type === "income" ? "text-green-600" : "text-red-600"}`}
                      >
                        {debt.type === "expense" && "-"}
                        {formatCurrency(debt.amount)}
                      </TableCell>

                      <TableCell className="py-0">{debt.concept}</TableCell>
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
                  ))}
                </TableBody>
              </Table>
              <div className="border-2 border-gray-100 bg-gray-50 p-3">
                <div className="flex gap-2 justify-start pl-4 py-3 pb-1">
                  <p className="font-medium">Total Ingresos:</p>
                  <p className="font-bold text-green-400">
                    {formatCurrency(total_income)}
                  </p>
                </div>

                <div className="flex gap-2 justify-start pl-4 py-3 pt-0">
                  <p className="font-medium">Total Egresos:</p>
                  <p className="font-bold text-red-400">-{formatCurrency(total_expense)}</p>
                </div>
                <div className="flex gap-2 justify-start pl-4 py-3 pt-0">
                  <p className="font-medium">Balance Cartera:</p>
                  <p className={`font-bold ${ total_balance >= 0 ? "text-blue-400" : "text-red-400"}`}>
                    {formatCurrency(
                     total_balance
                    )}
                  </p>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentPage === 0}
                  >
                    Anterior
                  </Button>
                  <span>
                    Página {currentPage + 1} de{" "}
                    {Math.ceil(debts.length / itemsPerPage)}
                  </span>
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(debts.length / itemsPerPage) - 1
                        )
                      )
                    }
                    disabled={endIndex >= debts.length}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3 flex-1 justify-center items-center h-full">
              <SearchIcon size={"3rem"} />
              <p className="text-xl font-bold">
                No se han encontrado movimientos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
