import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function YearOverview() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Ingresos 2024</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-lg lg:text-2xl font-bold text-green-400`}>
            $7,560,355
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Egresos 2024</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-lg lg:text-2xl font-bold text-red-400`}>
            -$3,470,320
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Balance 2024</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-lg lg:text-2xl font-bold text-blue-400`}>
            $4,560,355
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
