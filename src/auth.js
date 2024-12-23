import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import authConfig from "@/auth.config";
import { getIsActiveUser } from "./actions/CrudUser";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.isActive = user.isActive;
      } else if (token.id) {
        const response = await getIsActiveUser(token.id);
        if (response.success) {
          token.isActive = response?.data?.isActive ?? false;
        }
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.isActive = token.isActive;
      return session;
    },
  },
  ...authConfig,
});
