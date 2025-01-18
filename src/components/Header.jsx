import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { ButtonSignOut } from "@/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "@/components/icons";

export async function Header() {
  const {
    user: { name },
  } = await auth();

  return (
    <header className="flex h-16 max-w-full items-center justify-between border-b bg-background px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <Image
          alt="logo home click class"
          src="/logo.png"
          width={50}
          height={50}
        />
        <span className="hidden text-lg font-semibold sm:inline">Home Click Class</span>
      </Link>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="truncate font-medium text-sm sm:text-base capitalize">{name}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <SettingsIcon />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <ButtonSignOut />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
