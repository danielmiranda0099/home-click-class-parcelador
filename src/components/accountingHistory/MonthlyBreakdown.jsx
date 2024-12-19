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
import { formatCurrency } from "@/utils/formatCurrency";

const months_format = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre",
};

export function MonthlyBreakdown({ year, months }) {
  return (
    <Accordion type="multiple" className="w-full">
      {months.map((month) => (
        <AccordionItem
          className="mb-5"
          key={months_format[month.month]}
          value={`item-${months_format[month.month]}`}
        >
          <AccordionTrigger className="border-b-2 border-b-foreground p-0 hover:text-blue-500 hover:border-b-blue-500">
            {months_format[month.month]} - {year}
          </AccordionTrigger>
          <AccordionContent className="p-5">
            <MonthlyOverview month={month} />
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
