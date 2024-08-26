import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarUI } from "@/components/ui/Calendar";
import { CardUpcomingLesson } from "@/components/CardUpcomingLesson";

export default async function TeacherPage() {
  return (
    <>
      <section className="px-48 py-3 flex flex-row gap-4 justify-around">
        <CardUpcomingLesson />
        
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
              {/* <Button variant="outline" size="sm">
            View Transcript
          </Button> */}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Total Hours</div>
                  <div className="text-2xl font-bold">120</div>
                </div>
              </div>
              {/* <Button variant="outline" size="sm">
            View Details
          </Button> */}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="px-48 py-3">
        <CalendarUI />
      </section>
    </>
  );
}

function BookOpenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function ClockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function DollarSignIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
