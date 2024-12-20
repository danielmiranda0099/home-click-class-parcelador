import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MONTHS_OF_YEAR } from "@/utils/constans";
import { formatCurrency } from "@/utils/formatCurrency";

export function CardsMontlyReport({ monhtly_transactions }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ingresos {" "}
            {monhtly_transactions && MONTHS_OF_YEAR[monhtly_transactions.month]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">
            {monhtly_transactions
              ? formatCurrency(monhtly_transactions.total_income)
              : "$0"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Egresos {" "}
            {monhtly_transactions && MONTHS_OF_YEAR[monhtly_transactions.month]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">
            {monhtly_transactions
              ? formatCurrency(monhtly_transactions.total_expense)
              : "$0"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Balance {" "}
            {monhtly_transactions && MONTHS_OF_YEAR[monhtly_transactions.month]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${monhtly_transactions?.balance >= 0 ? "text-blue-400" : "text-red-400"}`}
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
