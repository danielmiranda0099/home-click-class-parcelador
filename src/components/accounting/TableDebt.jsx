"use client";

import { useState } from "react";
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
import {
  FilterIcon,
  PencilIcon,
  RepeatIcon,
  SearchIcon,
  TrashIcon,
} from "@/components/icons";
import { formatCurrency } from "@/utils/formatCurrency";
import { useLessonsStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";
import { PopupDeleteTransaction } from "./PopupDeleteTransaction";
import { deleteDebts, moveDebtToTransaction } from "@/actions/accounting";
import { useAccountingStore } from "@/store/accountingStore";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useCustomToast } from "@/hooks";
import { getLessonById } from "@/actions/CrudLesson";
import { formattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";

export function TableDebt({
  debts,
  handleGetAllDebt,
  setIsOpenFormDebt,
  handleGetMonhtlyTransactions,
}) {
  const [is_open_popup_delete, setIsOpenPopupDelete] = useState(false);
  const [transaction_id_current, setTransactionIdCurrent] = useState(null);
  const [filter_debt, setFilterDebt] = useState("all");
  const { setSelectedLesson } = useLessonsStore();
  const { setEditDebt } = useAccountingStore();

  const { setPopupDetailLesson } = useUiStore();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 15;

  const { toastSuccess, toastError } = useCustomToast();

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

  const handleShowLesson = async (id) => {
    const lesson = await getLessonById(id);
    const lesson_formated = await formattedLessonsForCalendar([lesson.data]);
    setSelectedLesson(lesson_formated[0]);
    setPopupDetailLesson(true);
  };

  return (
    <>
      <PopupDeleteTransaction
        is_open_popup_delete={is_open_popup_delete}
        setIsOpenPopupDelete={setIsOpenPopupDelete}
        transactionId={transaction_id_current}
        handleDispath={deleteDebts}
        handleAction={handleGetAllDebt}
      />
      <Card className="md:w-[40%] w-full">
        <CardHeader className="flex justify-between items-center p-4">
          <CardTitle className="text-lg font-bold">Cartera</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between h-[38.5rem] sm:h-[48.5rem] p-1 pb-6 gap-3">
          {debts?.length > 0 ? (
            <div className="flex flex-col justify-start h-[26rem] sm:h-[35.7rem] p-2 pb-6 gap-3">
              <div className="flex gap-2">
                <FilterIcon />
                <RadioGroup
                  defaultValue="all"
                  onValueChange={(value) => setFilterDebt(value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="all"
                      id="r-all"
                      className="data-[state=checked]:text-blue-400"
                    />
                    <Label htmlFor="r-all">Todo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="income"
                      id="r-income"
                      className="data-[state=checked]:text-green-400"
                    />
                    <Label htmlFor="r-income">Ingreso</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="expense"
                      id="r-expense"
                      className="data-[state=checked]:text-red-400"
                    />
                    <Label htmlFor="r-expense">Egreso</Label>
                  </div>
                </RadioGroup>
              </div>
              <Table className="relative">
                <TableHeader className="bg-slate-900 sticky top-0">
                  <TableRow className="hover:bg-current">
                    <TableHead className="">Monto</TableHead>
                    <TableHead className="">Concepto</TableHead>
                    <TableHead className=""></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-gray-100 border-2 max-h-[26rem] sm:max-h-[35.7rem] overflow-y-scroll">
                  {visibleDebts
                    ?.filter(
                      (debt) =>
                        filter_debt === "all" || debt.type === filter_debt
                    )
                    .map((debt) => (
                      <TableRow key={debt.id}>
                        <TableCell
                          className={`py-0 ${debt.type === "income" ? "text-green-600" : "text-red-600"}`}
                        >
                          {debt.type === "expense" && "-"}
                          {formatCurrency(debt.amount)}
                        </TableCell>

                        <TableCell className="py-0 min-w-56">
                          {debt.concept}
                        </TableCell>
                        <TableCell className="py-1">
                          {debt.lessonId && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleShowLesson(debt.lessonId)}
                            >
                              Ver
                            </Button>
                          )}
                          {!debt.lessonId && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Eliminar movimiento"
                                onClick={async () => {
                                  const response = await moveDebtToTransaction([
                                    debt.id,
                                  ]);
                                  if (response.success) {
                                    toastSuccess({
                                      title: "Cartera movido a transacción",
                                    });
                                    handleGetAllDebt();
                                    handleGetMonhtlyTransactions();
                                  } else {
                                    toastError({
                                      title: "Error al mover la cartera",
                                    });
                                  }
                                }}
                              >
                                <RepeatIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Editar movimiento"
                                onClick={() => {
                                  setEditDebt({
                                    id: debt.id,
                                    amount: debt.amount,
                                    type: debt.type,
                                    concept: debt.concept,
                                    expenseCategory:
                                      debt.type === "expense"
                                        ? debt.expenseCategory
                                        : null,
                                  });

                                  setIsOpenFormDebt(true);
                                }}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Eliminar movimiento"
                                onClick={() => {
                                  setTransactionIdCurrent(debt.id);
                                  setIsOpenPopupDelete(true);
                                }}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col gap-3 flex-1 justify-center items-center h-full">
              <SearchIcon size={"3rem"} />
              <p className="text-xl font-bold">
                No se han encontrado movimientos.
              </p>
            </div>
          )}

          {debts?.length > 0 && (
            <div className="border-2 border-gray-100 bg-gray-50 p-3 ">
              <div className="flex gap-2 justify-start pl-4 py-3 pb-0">
                <p className="font-medium">Total Ingresos:</p>
                <p className="font-bold text-green-400">
                  {formatCurrency(total_income)}
                </p>
              </div>

              <div className="flex gap-2 justify-start pl-4 py-3 pb-0 pt-0">
                <p className="font-medium">Total Egresos:</p>
                <p className="font-bold text-red-400">
                  -{formatCurrency(total_expense)}
                </p>
              </div>
              <div className="flex gap-2 justify-start pl-4 py-3 pt-0">
                <p className="font-medium">Balance Cartera:</p>
                <p
                  className={`font-bold ${total_balance >= 0 ? "text-blue-400" : "text-red-400"}`}
                >
                  {formatCurrency(total_balance)}
                </p>
              </div>

              <div className="flex gap-3 justify-center items-center">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                  className="text-xs sm:text-sm"
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
                  className="text-xs sm:text-sm"
                  disabled={endIndex >= debts.length}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
