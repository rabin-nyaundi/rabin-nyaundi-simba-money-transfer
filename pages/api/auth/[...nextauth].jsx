import NextAuth from "next-auth";
// import prisma from "../../../lib/prisma";
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

  secret: 'Mv7dfWJiJbs3ghNiGMnBzbl9YJTQxqFSNXVNEDjSV50=',

  callbacks: {
    async session(session, token) {
      if (userAccount !== null) {
        console.log("User Account ", userAccount);
        session.user = userAccount;
      }
      console.log(session);
      // else if (
      //   typeof token.user !== typeof undefined &&
      //   (typeof session.user === typeof undefined ||
      //     (typeof session.user !== typeof undefined &&
      //       typeof session.user.userId === typeof undefined))
      // ) {
      //   session.user = token.user;
      // } else if (typeof token !== typeof undefined) {
      //   session.token = token;
      // }
      return Promise.resolve(session);
    },

    async jwt({ token, user }) {
      const isSignedIn = user ? true : false;

      if (isSignedIn) {
        token.accessToken = user.id.toString() + "-" + user.email + "-" + user.password;
      }

      // if (user) {
      //   token.user = user
      // }
      return Promise.resolve(token);
    },

  },

  session: {
    jwt: true,
    maxAge: 24 * 60 * 60,
    strategy: "database",
  },

  jwt: {
    secret: 'Mv7dfWJiJbs3ghNiGMnBzbl9YJTQxqFSNXVNEDjSV50=',
    maxAge: 60 * 60 * 24 * 30,
  },

  pages: {
    error: "/auth/login",
    signIn: "/auth/login",
    signOut: "/auth/login",
  },


};
export default (req, res) => NextAuth(req, res, options);
