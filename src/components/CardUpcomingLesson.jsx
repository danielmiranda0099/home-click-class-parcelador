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
import { FormLesson } from "@/components/FormLesson";

export function CardUpcomingLesson({ rol }) {
  return (
    <Card className="w-[fit-content]">
      <CardHeader className="flex-row justify-between	 items-center	">
        <CardTitle>Upcoming Classes</CardTitle>
        {/* <FormLesson /> */}
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
              Ver
            </Button>
            {rol !== "student" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
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
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="grid gap-1 mr-4">
              <div className="font-medium">Advanced Physics Lab</div>
              <div className="text-sm text-muted-foreground">
                Wednesday, April 5, 2023 - 2:00 PM
              </div>
            </div>
            <Button variant="outline" size="sm" className="mr-2">
              Ver
            </Button>
            {rol !== "student" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
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
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="grid gap-1 mr-4">
              <div className="font-medium">Creative Writing Workshop</div>
              <div className="text-sm text-muted-foreground">
                Friday, April 7, 2023 - 4:30 PM
              </div>
            </div>
            <Button variant="outline" size="sm" className="mr-2">
              Ver
            </Button>
            {rol !== "student" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
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
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
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
