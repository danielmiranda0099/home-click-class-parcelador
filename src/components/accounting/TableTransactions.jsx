"use client";
import { useState } from "react";
import moment from "moment";
import {
  FilterIcon,
  PencilIcon,
  SearchIcon,
  TrashIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLessonsStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";
import { PopupDeleteTransaction } from "./PopupDeleteTransaction";
import { deleteTransactions } from "@/actions/accounting";
import { useAccountingStore } from "@/store/accountingStore";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { MONTHS_OF_YEAR } from "@/utils/constans";
import { getWeekDateRange } from "@/utils/getMonthDateRange";
import { getLessonById } from "@/actions/CrudLesson";

export function TableTransactions({
  monhtly_transactions,
  handleGetMonhtlyTransactions,
  setIsOpenFormTransaction,
  idPrefix = "",
  size = "lg",
}) {
  const [is_open_popup_delete, setIsOpenPopupDelete] = useState(false);
  const { lessons, setSelectedLesson, setLessons } = useLessonsStore();
  const [transaction_id_current, setTransactionIdCurrent] = useState(null);
  const { setPopupDetailLesson } = useUiStore();
  const [current_page, setCurrentPage] = useState(0);
  const [filter_transaction, setFilterTransaction] = useState("all");

  const { setEditTransaction } = useAccountingStore();

  const goToPage = (pageIndex) => {
    if (
      pageIndex >= 0 &&
      pageIndex < monhtly_transactions.all_transactions.length
    ) {
      setCurrentPage(pageIndex);
    }
  };

  const handleShowLesson = async (id) => {
    const lesson = await getLessonById(id);
    console.log(lesson)
    setSelectedLesson(lesson.data);
    setPopupDetailLesson(true);
  };

  return (
    <>
      <PopupDeleteTransaction
        is_open_popup_delete={is_open_popup_delete}
        setIsOpenPopupDelete={setIsOpenPopupDelete}
        transactionId={transaction_id_current}
        handleDispath={deleteTransactions}
        handleAction={handleGetMonhtlyTransactions}
      />
      <Card className="md:w-[60%] w-full">
        <CardHeader className="flex justify-between items-center p-4">
          <CardTitle className="text-lg font-bold">
            Movimientos{" "}
            {monhtly_transactions && MONTHS_OF_YEAR[monhtly_transactions.month]}{" "}
            - {monhtly_transactions && monhtly_transactions.year}
          </CardTitle>
        </CardHeader>
        <CardContent
          className={`flex flex-col justify-between ${size === "lg" ? "h-[38.5rem] sm:h-[48.5rem]" : "h-[38rem]"} p-1 pb-6 gap-3`}
        >
          {monhtly_transactions &&
          monhtly_transactions.all_transactions.length > 0 ? (
            <div
              className={`flex flex-col justify-start ${size === "lg" ? "h-[27.5rem] sm:h-[37.5rem]" : "h-[27.5rem]"} p-2 pb-6 gap-3`}
            >
              <div className="flex gap-2">
                <FilterIcon />
                <RadioGroup
                  defaultValue="all"
                  onValueChange={(value) => setFilterTransaction(value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="all"
                      id={`r1-${idPrefix}`}
                      className="data-[state=checked]:text-blue-400"
                    />
                    <Label htmlFor={`r1-${idPrefix}`}>Todo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="income"
                      id={`r2-${idPrefix}`}
                      className="data-[state=checked]:text-green-400"
                    />
                    <Label htmlFor={`r2-${idPrefix}`}>Ingreso</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="expense"
                      id={`r3-${idPrefix}`}
                      className="data-[state=checked]:text-red-400"
                    />
                    <Label htmlFor={`r3-${idPrefix}`}>Egreso</Label>
                  </div>
                </RadioGroup>
              </div>
              <Table className="relative">
                <TableHeader className="bg-slate-900 sticky top-0">
                  <TableRow className="hover:bg-current">
                    <TableHead className="">
                      Fecha <span className="text-[0.7rem]">(D-M-A)</span>
                    </TableHead>
                    <TableHead className="">Monto</TableHead>

                    <TableHead className="">Concepto</TableHead>
                    <TableHead className=""></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody
                  className={`border-gray-100 border-2 ${size === "lg" ? "max-h-[27.5rem] sm:max-h-[37.5rem]" : "max-h-[27.5rem]"} overflow-y-scroll`}
                >
                  {monhtly_transactions?.all_transactions[
                    current_page
                  ]?.transactions
                    .filter(
                      (transaction) =>
                        filter_transaction === "all" ||
                        transaction.type === filter_transaction
                    )
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="py-0 text-sm min-w-32">
                          {moment(transaction.date).utc().format("D-M-Y")}
                        </TableCell>
                        <TableCell
                          className={`py-0 ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.type === "expense" && "-"}
                          {formatCurrency(transaction.amount)}
                        </TableCell>

                        <TableCell className="py-0 min-w-56">
                          {transaction.concept}
                        </TableCell>
                        <TableCell className="py-1">
                          {transaction.lessonId && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleShowLesson(transaction.lessonId)
                              }
                            >
                              Ver
                            </Button>
                          )}
                          {!transaction.lessonId && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Editar movimiento"
                                onClick={() => {
                                  setEditTransaction({
                                    id: transaction.id,
                                    date: new Date(
                                      transaction.date
                                    ).toISOString(),
                                    amount: transaction.amount,
                                    type: transaction.type,
                                    concept: transaction.concept,
                                  });
                                  setIsOpenFormTransaction(true);
                                }}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Eliminar movimiento"
                                onClick={() => {
                                  setTransactionIdCurrent(transaction.id);
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
          {monhtly_transactions &&
            monhtly_transactions.all_transactions.length > 0 && (
              <div className="p-0 m-0">
                <div className="p-0 m-0">
                  <div className="flex gap-2 justify-start pl-4 py-0 pb-0">
                    <p className={`${size === "sm" && "text-sm"} font-medium`}>
                      Fecha:
                    </p>
                    <p
                      className={`${size === "sm" && "text-sm"} font-semibold`}
                    >
                      {getWeekDateRange(
                        monhtly_transactions.all_transactions[current_page]
                          .week,
                        monhtly_transactions.year
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-start pl-4 pb-0">
                    <p className={`${size === "sm" && "text-sm"} font-medium`}>
                      Ingreso semanal:
                    </p>
                    <p
                      className={`${size === "sm" && "text-sm"} font-bold text-green-400`}
                    >
                      {formatCurrency(
                        monhtly_transactions.all_transactions[current_page]
                          .income
                      )}
                    </p>
                  </div>

                  <div className="flex gap-2 justify-start pl-4 pb-0 pt-0">
                    <p className={`${size === "sm" && "text-sm"} font-medium`}>
                      Egreso semanal:
                    </p>
                    <p
                      className={`${size === "sm" && "text-sm"} font-bold text-red-400`}
                    >
                      {formatCurrency(
                        monhtly_transactions.all_transactions[current_page]
                          .expense
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-start pl-4 pt-0">
                    <p className={`${size === "sm" && "text-sm"} font-medium`}>
                      Balance semanal:
                    </p>
                    <p
                      className={`${size === "sm" && "text-sm"} font-bold ${1 >= 0 ? "text-blue-400" : "text-red-400"}`}
                    >
                      {formatCurrency(
                        monhtly_transactions.all_transactions[current_page]
                          .balance
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center justify-center m-0 p-0">
                  <Button
                    onClick={() => goToPage(current_page + 1)}
                    className="text-xs sm:text-sm"
                    disabled={
                      current_page ===
                      monhtly_transactions.all_transactions.length - 1
                    }
                  >
                    Anterior
                  </Button>
                  <span>
                    Página{" "}
                    {monhtly_transactions.all_transactions.length -
                      current_page}{" "}
                    de {monhtly_transactions.all_transactions.length}
                  </span>
                  <Button
                    onClick={() => goToPage(current_page - 1)}
                    className="text-xs sm:text-sm"
                    disabled={current_page === 0}
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
