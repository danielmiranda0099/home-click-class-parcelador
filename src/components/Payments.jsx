"use client";
import { useState } from "react";
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

export function Payments() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payments, setPayments] = useState([
    { student: "Alice Smith", date: "2023-05-01", price: 100 },
    { student: "Bob Johnson", date: "2023-05-02", price: 150 },
    { student: "Charlie Brown", date: "2023-05-03", price: 200 },
  ]);

  const totalSum = payments.reduce((sum, payment) => sum + payment.price, 0);

  const handleSearch = () => {
    // Implement search functionality here
    console.log("Searching for payments between", startDate, "and", endDate);
  };

  const handleConfirmPayment = () => {
    // Implement payment confirmation here
    console.log("Confirming payment of", totalSum);
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
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>
        <div className="space-y-4 p-5 rounded-lg border bg-card text-card-foreground shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Payment Data</h2>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] text-primary font-bold">
                    Student
                  </TableHead>
                  <TableHead className="w-[30%] text-primary font-bold">
                    Date
                  </TableHead>
                  <TableHead className="w-[30%] text-primary text-right font-bold">
                    Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell>{payment.student}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell className="text-right">
                      ${payment.price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="px-4 py-2 border-t">
              <div className="grid grid-cols-10">
                <div className="col-span-7 font-bold">Total:</div>
                <div className="col-span-3 text-right font-bold">
                  ${totalSum.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <Button onClick={handleConfirmPayment} className="w-full">
            Confirm Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
