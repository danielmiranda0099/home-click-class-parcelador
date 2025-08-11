import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MONTHS_OF_YEAR } from "@/utils/constans";
import { formatCurrency } from "@/utils/formatCurrency";

export function CardsMontlyReport({ monhtly_transactions }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-green-400">
            {monhtly_transactions
              ? formatCurrency(monhtly_transactions.totalIncome)
              : "$0"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Profesor Egresos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-red-400">
            {monhtly_transactions
              ? "-" + formatCurrency(monhtly_transactions.expenseTeacher)
              : "$0"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Otros Egresos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-red-400">
            {monhtly_transactions
              ? "-" + formatCurrency(monhtly_transactions.expenseOther)
              : "$0"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Egresos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-red-400">
            {monhtly_transactions
              ? "-" + formatCurrency(monhtly_transactions.totalExpense)
              : "$0"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-xl sm:text-2xl font-bold ${monhtly_transactions?.balance >= 0 ? "text-blue-400" : "text-red-400"}`}
          >
            {monhtly_transactions
              ? formatCurrency(monhtly_transactions.balance)
              : "$0"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
