import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarUI } from "@/components/ui/Calendar";
import { FormNewClass } from "@/components/FormNewClass";

const events = [
  {
    id: "1-event",
    title: "Event 1",
    start: "2024-08-20 01:05",
    end: "2024-08-20 02:35",
  },
  {
    id: "2-event",
    title: "Event 2",
    start: "2024-08-20 10:05",
    end: "2024-08-20 10:35",
  },
  {
    id: "3-event",
    title: "Event 3",
    start: "2024-08-20 10:05",
    end: "2024-08-20 10:35",
  },
];

export default function TeacherPage() {
  return (
    <>
      <section className="px-48 py-3 flex flex-row gap-4 justify-around">
        <Card className="w-[fit-content]">
          <CardHeader className="flex-row justify-between	 items-center	">
            <CardTitle>Upcoming Classes</CardTitle>
            <FormNewClass />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="grid gap-1 mr-4">
                  <div className="font-medium">Introduction to Calculus</div>
                  <div className="text-sm text-muted-foreground">
                    Monday, April 3, 2023 - 9:00 AM
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mr-2">
                  Ir
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <MoreOptionsIcon className="h-5 w-5" />
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link
                        href="#"
                        className="flex items-center gap-2"
                        prefetch={false}
                      >
                        <div className="h-4 w-4" />
                        <span>Reagendar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link
                        href="#"
                        className="flex items-center gap-2"
                        prefetch={false}
                      >
                        <div className="h-4 w-4" />
                        <span>Editar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="#"
                        className="flex items-center gap-2"
                        prefetch={false}
                      >
                        <div className="h-4 w-4" />
                        <span>Cancelar</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between">
                <div className="grid gap-1 mr-4">
                  <div className="font-medium">Advanced Physics Lab</div>
                  <div className="text-sm text-muted-foreground">
                    Wednesday, April 5, 2023 - 2:00 PM
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mr-2">
                  Ir
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <MoreOptionsIcon className="h-5 w-5" />
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link
                        href="#"
                        className="flex items-center gap-2"
                        prefetch={false}
                      >
                        <div className="h-4 w-4" />
                        <span>Reagendar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link
                        href="#"
                        className="flex items-center gap-2"
                        prefetch={false}
                      >
                        <div className="h-4 w-4" />
                        <span>Editar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="#"
                        className="flex items-center gap-2"
                        prefetch={false}
                      >
                        <div className="h-4 w-4" />
                        <span>Cancelar</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between">
                <div className="grid gap-1 mr-4">
                  <div className="font-medium">Creative Writing Workshop</div>
                  <div className="text-sm text-muted-foreground">
                    Friday, April 7, 2023 - 4:30 PM
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mr-2">
                  Ir
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <MoreOptionsIcon className="h-5 w-5" />
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link
                        href="#"
                        className="flex items-center gap-2"
                        prefetch={false}
                      >
                        <div className="h-4 w-4" />
                        <span>Reagendar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link
                        href="#"
                        className="flex items-center gap-2"
                        prefetch={false}
                      >
                        <div className="h-4 w-4" />
                        <span>Editar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="#"
                        className="flex items-center gap-2"
                        prefetch={false}
                      >
                        <div className="h-4 w-4" />
                        <span>Cancelar</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

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
        <CalendarUI events={events} />
      </section>
    </>
  );
}

function MoreOptionsIcon(props) {
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
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
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
