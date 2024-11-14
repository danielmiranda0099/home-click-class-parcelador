"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/userStore";
import { processPaymentByRole, unpaidLessons } from "@/actions/CrudLesson";
import { formatCurrency } from "@/utils/formatCurrency";
import { PaperSearchIcon } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { usePaymentViewStore } from "@/store/paymentViewStore";
import { useLessonsStore } from "@/store/lessonStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUiStore } from "@/store/uiStores";
import { ErrorAlert } from "@/components";
import { useCustomToast } from "@/hooks";

//TODO: Refact component
export function Payments() {
  const {
    start_date,
    setStartDate,
    end_date,
    setEndDate,
    payments,
    fetchPayments,
    setPayments,
  } = usePaymentViewStore();
  const { lessons, setLessons, setSelectedLesson } = useLessonsStore();
  const [total, setTotal] = useState(0);
  const { user_selected: user } = useUserStore();
  const { setPopupDetailLesson } = useUiStore();
  const { toastSuccess } = useCustomToast();
  const [state_form_search, setStateFormSearch] = useState({
    pending: false,
    message: "",
  });
  const [state_form_payment, setStateFormPayment] = useState({
    pending: false,
    message: "",
  });

  useEffect(() => {
    const total = payments?.reduce(
      (sum, payment) => (payment.isPay ? sum + payment.price : sum + 0),
      0
    );
    setTotal(total);
  }, [payments]);

  useEffect(() => {
    if (start_date && end_date && user) {
      handleSearch();
    }
  }, [user, lessons]);

  const handleSearch = () => {
    setStateFormSearch((prev) => ({ ...prev, pending: true }));

    unpaidLessons(user?.id, start_date, end_date).then((response) => {
      setStateFormSearch((prev) => ({ ...prev, pending: false }));
      if (response.success) {
        setStateFormSearch((prev) => ({ ...prev, message: "" }));
        fetchPayments(response.data, user);
      }
      if (response.error) {
        setStateFormSearch((prev) => ({ ...prev, message: response.message }));
      }
    });
    setStateFormSearch((prev) => ({ ...prev, message: "" }));
  };

  const handleConfirmPayment = async () => {
    setStateFormPayment((prev) => ({ ...prev, pending: true }));

    processPaymentByRole(payments, user).then((response) => {
      setStateFormPayment((prev) => ({ ...prev, pending: false }));
      if (response.success) {
        setStateFormPayment((prev) => ({ ...prev, message: "" }));
        setLessons("admin");
        toastSuccess({ title: "Pago Confirmado" });
        handleSearch();
      }
      if (response.error) {
        setStateFormPayment((prev) => ({ ...prev, message: response.message }));
      }
    });
    setStateFormPayment((prev) => ({ ...prev, message: "" }));
  };

  const handleCheckAll = (value) => {
    setPayments(payments.map((lesson) => ({ ...lesson, isPay: value })));
  };

  const handleCheck = (value, id) => {
    setPayments(
      payments.map((payment) =>
        payment.id === id ? { ...payment, isPay: value } : payment
      )
    );
  };

  const handleClickShow = (id) => {
    const lesson = lessons.find((lesson) => lesson.id === id);
    setSelectedLesson(lesson);
    setPopupDetailLesson(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-[35%_65%] gap-8">
        <div>
          <div className="space-y-4 p-5 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Date Range</h2>
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={end_date}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch} disabled={state_form_search.pending}>
              Search
            </Button>

            <ErrorAlert message={state_form_search.message} />
          </div>
        </div>
        <div className="space-y-4 p-5 rounded-lg border bg-card text-card-foreground shadow-sm">
          {payments && user ? (
            <>
              <div>
                <h2 className="text-xl font-bold mb-4">
                  Clases a pagar
                  {"  "}
                  {payments &&
                    `${payments.filter((lesson) => lesson.isPay).length} / ${payments.length}`}
                </h2>
              </div>

              <div className="border relative rounded-md max-h-[50vh] overflow-y-auto">
                <Table className="max-h-[50vh] overflow-y-auto">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-primary font-bold flex justify-start items-center">
                        <Checkbox
                          onCheckedChange={handleCheckAll}
                          defaultChecked={true}
                        />
                      </TableHead>

                      <TableHead className="text-primary font-bold">
                        Nombre
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Rol
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Type
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Status
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Fecha
                      </TableHead>
                      <TableHead className="text-primary font-bold w-fit"></TableHead>
                      <TableHead className="text-primary text-right font-bold">
                        Valor
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments?.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Checkbox
                            checked={payment.isPay}
                            onCheckedChange={(value) =>
                              handleCheck(value, payment.id)
                            }
                          />
                        </TableCell>

                        <TableCell>
                          {user?.firstName.split(" ")[0] +
                            " " +
                            user?.lastName.split(" ")[0]}
                        </TableCell>
                        <TableCell>{user?.role}</TableCell>
                        <TableCell>
                          {payment.isGroup ? "Grupal" : "Individual"}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div
                                  className="w-6 h-6 rounded-full"
                                  style={{
                                    backgroundColor: payment?.background,
                                  }}
                                ></div>
                              </TooltipTrigger>

                              <TooltipContent>
                                <p className="p-3 font-bold">
                                  {payment.lesson_status}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>

                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className=""
                            onClick={() => handleClickShow(payment.id)}
                          >
                            ver
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(payment.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="px-4 py-2 sticky bottom-0 bg-white border">
                  <div className="grid grid-cols-10">
                    <div className="col-span-7 font-bold">Total:</div>
                    <div className="col-span-3 text-right font-bold">
                      {formatCurrency(total?.toFixed(2))}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleConfirmPayment}
                className="w-full disabled:pointer-events-auto disabled:cursor-not-allowed"
                disabled={
                  payments.filter((lesson) => lesson.isPay).length <= 0 ||
                  state_form_payment.pending
                }
              >
                Confirm Payment
              </Button>

              <ErrorAlert message={state_form_payment.message} />
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <PaperSearchIcon size={42} />
              <h1 className="text-xl font-medium">
                No se han encontrado clases por pagar.
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
