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
import { PayTeacher, UnpaidLessons } from "@/actions/CrudLesson";
import { formatPayments } from "@/utils/formatPayments";
import { formatCurrency } from "@/utils/formatCurrency";
import { PaperSearchIcon } from "./icons";

export function Payments() {
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [payments, setPayments] = useState(null);
  const [total, setTotal] = useState(0);
  const { user_selected: user } = useUserStore();

  useEffect(() => {
    const total = payments?.reduce((sum, payment) => sum + payment.price, 0);
    console.log();
    setTotal(total);
  }, [payments]);

  useEffect(() => {
    handleSearch();
  }, [user]);

  const handleSearch = async () => {
    if (!user || start_date.length <= 0 || end_date.length <= 0) return;

    // Implement search functionality here
    console.log(
      "Searching for payments between",
      new Date(start_date).toISOString(),
      "and",
      end_date
    );
    const unpaid_lessons = await UnpaidLessons(
      user?.id,
      new Date(start_date).toISOString(),
      new Date(end_date).toISOString()
    );
    const unpaid_lesson_formated = formatPayments(unpaid_lessons, user);
    console.log("unpaid_lesson_formated", unpaid_lesson_formated);
    setPayments(unpaid_lesson_formated);
  };

  const handleConfirmPayment = () => {
    if (!payments || !user) return;
    // Implement payment confirmation here
    console.log("Confirming payment of", total);
    const unpaid_lesson_ids = payments?.map((lesson) => lesson.id);
    if (user.role === "teacher") PayTeacher(unpaid_lesson_ids);
    console.log(unpaid_lesson_ids);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>
        <div className="space-y-4 p-5 rounded-lg border bg-card text-card-foreground shadow-sm">
          {payments && user ? (
            <>
              <h2 className="text-2xl font-bold mb-4">
                Payment Data {payments && `(${payments.length})`}
              </h2>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-primary font-bold">
                        Nombre
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Rol
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Fecha
                      </TableHead>
                      <TableHead className="text-primary text-right font-bold">
                        Valor
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments?.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {user?.firstName.split(" ")[0] +
                            " " +
                            user?.lastName.split(" ")[0]}
                        </TableCell>
                        <TableCell>{user?.role}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(payment.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="px-4 py-2 border-t">
                  <div className="grid grid-cols-10">
                    <div className="col-span-7 font-bold">Total:</div>
                    <div className="col-span-3 text-right font-bold">
                      {formatCurrency(total?.toFixed(2))}
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={handleConfirmPayment} className="w-full">
                Confirm Payment
              </Button>
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
