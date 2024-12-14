"use client";
import moment from "moment";
import { PencilIcon, SearchIcon, TrashIcon } from "@/components/icons";
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
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLessonsStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";
import { PopupDeleteTransaction } from "./PopupDeleteTransaction";
import { deleteTransactions } from "@/actions/accounting";
import { useAccountingStore } from "@/store/accountingStore";

export function TableTransactions({
  monhtly_transactions,
  handleGetMonhtlyTransactions,
  setIsOpenFormTransaction
}) {
  const [is_open_popup_delete, setIsOpenPopupDelete] = useState(false);
  const { lessons, setSelectedLesson, setLessons } = useLessonsStore();
  const [transaction_id_current, setTransactionIdCurrent] = useState(null);
  const { setPopupDetailLesson } = useUiStore();
  const [current_page, setCurrentPage] = useState(0);

  const {setEditTransaction} = useAccountingStore();

  const goToPage = (pageIndex) => {
    if (
      pageIndex >= 0 &&
      pageIndex < monhtly_transactions.all_transactions.length
    ) {
      setCurrentPage(pageIndex);
    }
  };

  const getLessonById = (id) => {
    return lessons.find((lesson) => lesson.id === id);
  };

  const handleShowLesson = (id) => {
    const lesson = getLessonById(id);
    setSelectedLesson(lesson);
    setPopupDetailLesson(true);
  };

  useEffect(() => {
    if (lessons.length < 1) {
      setLessons("admin");
    }
  }, []);
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
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Movimientos Del Mes Actual</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between h-[40rem] p-2 pb-6 gap-3">
          {monhtly_transactions &&
          monhtly_transactions.all_transactions.length > 0 ? (
            <Table className="relative">
              <TableHeader className="bg-slate-900 sticky top-0">
                <TableRow className="hover:bg-current">
                  <TableHead className="">Fecha</TableHead>
                  <TableHead className="">Monto</TableHead>

                  <TableHead className="">Concepto</TableHead>
                  <TableHead className=""></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border-gray-100 border-2 max-h-[40rem] overflow-y-scroll">
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
                    <TableCell className="py-1">
                      {transaction.lessonId && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleShowLesson(transaction.lessonId)}
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
                                date: new Date(transaction.date).toISOString(),
                                amount: transaction.amount,
                                type: transaction.type,
                                concept: transaction.concept,
                              });
                              setIsOpenFormTransaction(true);
                            }}                          >
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
                <span>
                  Página {current_page + 1} de{" "}
                  {monhtly_transactions.all_transactions.length}
                </span>
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
    </>
  );
}
