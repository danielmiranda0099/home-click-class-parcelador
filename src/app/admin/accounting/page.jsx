"use client";
import { useFormState, useFormStatus } from "react-dom";
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
import {
  createNewTransaction,
  getMonhtlyTransactions,
  getWeeklyTransactions,
} from "@/actions/accounting";
import { useEffect, useState } from "react";
import { getMonth } from "date-fns";
import { formatCurrency } from "@/utils/formatCurrency";
import { SearchIcon } from "@/components/icons";
import { ErrorAlert, InputPriceLesson } from "@/components";
import { parseCurrencyToNumber } from "@/utils/parseCurrencyToNumber";
import { useCustomToast } from "@/hooks";
import { CardsMontlyReport } from "@/components/accounting";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      Crear
    </Button>
  );
}

export default function AccountingPage() {
  const [monhtly_transactions, setMonhtlyTransactions] = useState(null);
  const [current_page, setCurrentPage] = useState(0);
  const [form_state, dispath] = useFormState(createNewTransaction, {
    data: [],
    success: null,
    error: false,
    message: null,
  });
  const [error_message, setErrorMessage] = useState("");
  const [amount_transaction, setAmountTransaction] = useState();
  const [is_open_form_new_transaction, setIsOpenFormNewTransaction] =
    useState(false);

  const { toastSuccess } = useCustomToast();

  const handleGetMonhtlyTransactions = async () => {
    const response_monhtly_transactions = await getMonhtlyTransactions(
      getMonth(new Date()) + 1
    );
    if (response_monhtly_transactions.success) {
      setMonhtlyTransactions(response_monhtly_transactions.data);
    } else {
      setMonhtlyTransactions(null);
    }
  };

  const goToPage = (pageIndex) => {
    if (
      pageIndex >= 0 &&
      pageIndex < monhtly_transactions.all_transactions.length
    ) {
      setCurrentPage(pageIndex);
    }
  };

  const onCreateNewTransaction = (form_data) => {
    form_data.forEach((value, key) => {
      console.log(key, value);
    });
    const data = {
      date: form_data.get("date"),
      amount: parseCurrencyToNumber(form_data.get("amount")),
      type: form_data.get("type"),
      concept: form_data.get("concept"),
    };
    dispath(data);
    setErrorMessage("");
  };

  useEffect(() => {
    handleGetMonhtlyTransactions();
  }, []);

  useEffect(() => {
    if (form_state.success) {
      handleGetMonhtlyTransactions();
      toastSuccess({ title: "Movimiento creado exitosamente." });
      setIsOpenFormNewTransaction(false);
    }
    if (form_state.error) {
      setErrorMessage(form_state.message);
    } else {
      setErrorMessage("");
    }
  }, [form_state]);

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
          <Dialog
            open={is_open_form_new_transaction}
            onOpenChange={setIsOpenFormNewTransaction}
          >
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
              <form className="space-y-4" action={onCreateNewTransaction}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input
                      id="fecha"
                      type="date"
                      name="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monto">Monto</Label>
                    {/* TODO: Refact Name component <InputPriceLesson /> */}
                    <InputPriceLesson
                      name="amount"
                      value={amount_transaction}
                      setValue={setAmountTransaction}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Tipo</Label>
                  <Select name="type">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Ingreso</SelectItem>
                      <SelectItem value="expense">Egreso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Concepto</Label>
                  <Input
                    id="descripcion"
                    placeholder="Ingrese una descripción"
                    name="concept"
                  />
                </div>
                <div className="mb-6">
                  <ErrorAlert message={error_message} />
                </div>
                <div className="flex justify-between">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <SubmitButton />
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

        <CardsMontlyReport monhtly_transactions={monhtly_transactions} />

        <div
          className="flex flex-col md:flex-row gap-3 mb-8 items-start
        "
        >
          <Card className="md:w-[60%] w-full">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Movimientos Del Mes Actual</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between min-h-[25rem] p-2 pb-6 gap-3">
              {monhtly_transactions &&
              monhtly_transactions.all_transactions.length > 0 ? (
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
                    {monhtly_transactions?.all_transactions[
                      current_page
                    ]?.transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="py-0 text-sm min-w-24">
                          {moment(transaction.date).utc().format("D-M-Y")}
                        </TableCell>
                        <TableCell
                          className={`py-0 ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.type === "expense" && "-"}
                          {formatCurrency(transaction.amount)}
                        </TableCell>

                        <TableCell className="py-0">
                          {transaction.concept}
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
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col gap-3 flex-1 justify-center items-center h-full">
                  <SearchIcon size={"3rem"} />
                  <p className="text-xl font-bold">
                    No se han encontrado movimientos.
                  </p>
                </div>
              )}

              {monhtly_transactions &&
                monhtly_transactions.all_transactions.length > 0 && (
                  <div className="flex gap-2 items-center justify-center">
                    <Button
                      onClick={() => goToPage(current_page + 1)}
                      disabled={
                        current_page ===
                        monhtly_transactions.all_transactions.length - 1
                      }
                    >
                      Semana Anterior
                    </Button>
                    <Button
                      onClick={() => goToPage(current_page - 1)}
                      disabled={current_page === 0}
                    >
                      Semana Siguiente
                    </Button>
                  </div>
                )}
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
