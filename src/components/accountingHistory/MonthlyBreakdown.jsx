import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";
import { TableTransactionsMonthly } from "./TableTransactionsMonthly";
import { MONTHS_OF_YEAR } from "@/utils/constans";



export function MonthlyBreakdown({ year, months, setIsOpenFormTransaction }) {
  return (
    <Accordion type="multiple" className="w-full">
      {months.map((month, index) => (
        <AccordionItem
          className="mb-5"
          key={`${MONTHS_OF_YEAR[month.month]}-${year}`}
          value={`item-${MONTHS_OF_YEAR[month.month]}`}
        >
          <AccordionTrigger className="border-b-2 border-b-foreground p-0 hover:text-blue-500 hover:border-b-blue-500">
            {MONTHS_OF_YEAR[month.month]} - {year}
          </AccordionTrigger>
          <AccordionContent className="p-5">
            <MonthlyOverview month={month} />

            <TableTransactionsMonthly month={month.month} year={year} setIsOpenFormTransaction={setIsOpenFormTransaction} idPrefix={index} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function MonthlyOverview({ month }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-green-400">
            {formatCurrency(month.income)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Egresos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-red-400">
            -{formatCurrency(month.expense)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-lg font-bold ${month.income - month.expense >= 0 ? "text-blue-400" : "text-red-400"}`}
          >
            {formatCurrency(month.income - month.expense)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
