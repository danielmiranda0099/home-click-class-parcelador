import { handleSignOut } from "@/actions/login";
import { NextResponse } from "next/server";

export async function GET() {
  await handleSignOut();
  return NextResponse.redirect(new URL("/", process.env.AUTH_URL));
}
