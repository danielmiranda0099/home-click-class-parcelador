import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";

export function YearOverview({year, balance}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Ingresos {year}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-lg lg:text-2xl font-bold text-green-400`}>
            {formatCurrency(balance.income)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Egresos {year}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-lg lg:text-2xl font-bold text-red-400`}>
            -{formatCurrency(balance.expense)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Balance {year}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-lg lg:text-2xl font-bold  ${(balance.income - balance.expense) >= 0 ? "text-blue-400" : "text-red-400"}`}>
            {formatCurrency(balance.income - balance.expense)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
