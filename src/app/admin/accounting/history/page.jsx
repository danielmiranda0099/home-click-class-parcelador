"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HeaderAccountingHistory, YearOverview } from "@/components/accountingHistory";

export default function AccountingHistoryPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <HeaderAccountingHistory />
       
       <YearOverview />

      <MonthlyBreakdown />
    </div>

  );
}


const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function MonthlyBreakdown() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {months.map((month, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{month}</AccordionTrigger>
          <AccordionContent>
            <MonthlyOverview month={month} />
            <TransactionsTable month={month} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function MonthlyOverview({ month }) {
  // This would typically come from your data source
  const monthData = {
    income: 10000,
    expenses: 7000,
    balance: 3000,
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-green-600">
            ${monthData.income.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-red-600">
            ${monthData.expenses.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-blue-600">
            ${monthData.balance.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TransactionsTable({ month }) {
  // This would typically come from your data source
  const transactions = [
    {
      date: "2023-05-01",
      description: "Salary",
      category: "Income",
      amount: 5000,
      type: "Income",
    },
    {
      date: "2023-05-02",
      description: "Rent",
      category: "Housing",
      amount: 1500,
      type: "Expense",
    },
    {
      date: "2023-05-03",
      description: "Groceries",
      category: "Food",
      amount: 200,
      type: "Expense",
    },
    // Add more transactions as needed
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction, index) => (
          <TableRow key={index}>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell
              className={
                transaction.type === "Income"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              ${transaction.amount.toLocaleString()}
            </TableCell>
            <TableCell>{transaction.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}





