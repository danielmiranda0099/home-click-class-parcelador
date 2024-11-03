import Credentials from "next-auth/providers/credentials";
export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        // let user = null

        // const pwHash = saltAndHashPassword(credentials.password)

        // user = await getUserFromDb(credentials.email, pwHash)

        // if (!user) {
        //   throw new Error("Invalid credentials.")
        // }

        // return user
        console.log(credentials);
        return {
          id: "1",
          email: "daniel@gmail.com auth.config",
        };
      },
    }),
  ],
};
