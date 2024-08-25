import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const USERS = {
  "daniel@gmail.com": "admin",
  "estudiante@gmail.com": "student",
  "profe@gmail.com": "teacher",
}

const handleSignIn = async(formData) => {
  'use server'

  const email = formData.get("email");
  
  if(!USERS[email]){
    console.log("error")
  }

  const role = USERS[email]

  if(role === "admin"){
    redirect("/dashboard")
  }
  if(role === "student"){
    redirect("/students")
  }
  if(role === "teacher"){
    redirect("/teachers")
  }
}


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <MountainIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Home Class.</h1>
          <p className="text-muted-foreground">Welcome to our platform</p>
        </div>
        <form className="space-y-4" action={handleSignIn}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-sm text-muted-foreground hover:underline" prefetch={false}>
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" name="password" required />
          </div>

          <Button type="submit" className="w-full space-y-2">
            Sign in
          </Button>
        </form>
      </div>
    </div>
    </main>
  );
}

function MountainIcon(props) {
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
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
