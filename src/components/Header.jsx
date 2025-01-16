import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "@/components/icons";
import Image from "next/image";
import { auth } from "@/auth";
import { ButtonSignOut } from "@/components";

export async function Header() {
  const {
    user: { name },
  } = await auth();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
      <Link href="#" className="flex items-center gap-2" prefetch={false}>
        <Image
          alt="logo home click class"
          src="/logo.png"
          width={50}
          height={50}
        />
        <span className="text-lg font-semibold">Home Click Class</span>
      </Link>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-medium capitalize">{name}</span>
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
