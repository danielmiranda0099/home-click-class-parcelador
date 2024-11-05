import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import prisma from "./lib/prisma";
import authConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      return session;
    },
  },
  ...authConfig,
});
