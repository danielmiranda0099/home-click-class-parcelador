import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpenIcon, ClockIcon, DollarSignIcon } from "@/components/icons";

export function CardOverView() {
  return (
    <Card className="w-[fit-content]">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Total Debt</div>
              <div className="text-2xl font-bold">$2,500</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Lessons Completed</div>
              <div className="text-2xl font-bold">42</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Total Hours</div>
              <div className="text-2xl font-bold">120</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
