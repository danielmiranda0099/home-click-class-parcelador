"use client";
import { useFormState } from "react-dom";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  createNewTransaction,
  getMonhtlyTransactions,
} from "@/actions/accounting";
import { useEffect, useState } from "react";
import { getMonth } from "date-fns";
import { parseCurrencyToNumber } from "@/utils/parseCurrencyToNumber";
import { useCustomToast } from "@/hooks";
import {
  CardsMontlyReport,
  PopupFormCreateNewDebt,
  PopupFormCreateNewTransaction,
  TableTransactions,
} from "@/components/accounting";

export default function AccountingPage() {
  const [monhtly_transactions, setMonhtlyTransactions] = useState(null);

  const [form_state, dispath] = useFormState(createNewTransaction, {
    data: [],
    success: null,
    error: false,
    message: null,
  });
  const [
    error_message_form_new_transaction,
    setErrorMessageFormNewTransaction,
  ] = useState("");
  const [error_message_form_new_Debt, setErrorMessageFormNewDebt] =
    useState("");

  const [is_open_form_new_transaction, setIsOpenFormNewTransaction] =
    useState(false);

  const [is_open_form_new_debt, setIsOpenFormNewDebt] = useState(false);

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
    setErrorMessageFormNewTransaction("");
  };

  const onCreateNewDebt = (form_data) => {
    form_data.forEach((data) => console.log(data));
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
      setErrorMessageFormNewTransaction(form_state.message);
    } else {
      setErrorMessageFormNewTransaction("");
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

          <PopupFormCreateNewTransaction
            is_open={is_open_form_new_transaction}
            setIsOpen={setIsOpenFormNewTransaction}
            onCreateNewTransaction={onCreateNewTransaction}
            error_message={error_message_form_new_transaction}
          />
          <PopupFormCreateNewDebt
            is_open={is_open_form_new_debt}
            setIsOpen={setIsOpenFormNewDebt}
            error_message={error_message_form_new_Debt}
            onCreateNewDebt={onCreateNewDebt}
          />
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
              <TableTransactions monhtly_transactions={monhtly_transactions} />
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
