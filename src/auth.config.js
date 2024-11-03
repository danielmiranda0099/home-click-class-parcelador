import Credentials from "next-auth/providers/credentials";
export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        if (!credentials.email || !credentials.password) {
          throw new Error("Error en auth.config");
        }
        console.log(credentials);
        return {
          id: "1",
          email: "daniel@gmail.com auth.config",
        };
      },
    }),
  ],
};
