import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let userAccount;

const options = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("User with email not found");
          }
          const checkPassword = await compare(
            credentials.password,
            user.password
          );

          if (!checkPassword) {
            throw new Error("Invalid password");
          }

          userAccount = user;
          console.log(userAccount);
          return Promise.resolve(user);

        } catch (error) {
          throw new Error(error);
        }

      },
    }),
  ],

  secret: 'Z2knOid/f9JZWVeAQJmxXXEt+MVYpZCn4JyPENhPXJY=',
  
  session: {
    // jwt: true,
    maxAge: 24 * 60 * 60,
    strategy: "jwt"
  },


  jwt: {
    secret: 'ITCryLP6gNxLuxLAaKIPol/CfwfZWHla1Wo2uoZXzp0=',
    maxAge: 60 * 60 * 24 * 30,
    encryption: true
  },

  pages: {
    error: "/auth/login",
    signIn: "/auth/login",
    signOut: "/auth/login",
  },

  callbacks: {
    async session(session, token) {
      if (userAccount !== null) {
        console.log("User Account ", userAccount);
        session.user = userAccount;
      }
      console.log(session);
      return Promise.resolve(session);
    },

    async jwt({ token, user }) {
      const isSignedIn = user ? true : false;

      if (isSignedIn) {
        token.accessToken = user.id.toString() + "-" + user.email + "-" + user.password;
      }

      return Promise.resolve(token);
    },

  },


};
export default (req, res) => NextAuth(req, res, options);
