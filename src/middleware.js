import { NextResponse } from "next/server";
import { auth } from "./auth";

const public_routes = ["/", "/api/check-debts"];

export default auth(async (req) => {
  const { nextUrl, auth } = req;
  const isLogged = !!auth?.user;
  const isActive = auth?.user?.isActive;

  if (!public_routes.includes(nextUrl.pathname) && (!isLogged || !isActive)) {
    const response = NextResponse.redirect(new URL("/", nextUrl));

    // Borrar las cookies relacionadas con la autenticación
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("next-auth.csrf-token");
    response.cookies.delete("next-auth.callback-url");
    response.cookies.delete("__Secure-next-auth.callback-url");

    // Si estás usando cookies seguras (HTTPS), asegúrate de borrarlas también
    response.cookies.delete("__Secure-next-auth.session-token");
    response.headers.set("X-User-Active", "false");
    return response;
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
