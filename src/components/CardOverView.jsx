import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpenIcon, ClockIcon, DollarSignIcon } from "@/components/icons";

export function CardOverView() {
  return (
    <Card className="w-[fit-content]">
      <CardHeader>
        <CardTitle>Resumen De Clases</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-10 grid-flow-col auto-cols-max">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-start gap-2">
            <DollarSignIcon size="28" className="text-muted-foreground" />
            <div className="flex flex-col items-start justify-center">
              <span className="text-xl font-medium text-muted-foreground block">
                Deuda:
              </span>
            </div>
          </div>

          <h2 className="text-lg font-bold">$2,500</h2>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-start gap-2">
            <BookOpenIcon size="28" className="text-muted-foreground" />
            <div className="flex flex-col items-start justify-center">
              <span className="text-xl font-medium text-muted-foreground block">
                Completadas:
              </span>
            </div>
          </div>

          <h2 className="text-lg font-bold">42</h2>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-start gap-2">
            <ClockIcon size="28" className="text-muted-foreground" />
            <div className="flex flex-col items-start justify-center">
              <span className="text-xl font-medium text-muted-foreground block">
                Total Hours:
              </span>
            </div>
          </div>

          <h2 className="text-lg font-bold">120h</h2>
        </div>
      </CardContent>
    </Card>
  );
}
