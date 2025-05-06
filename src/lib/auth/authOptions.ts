import { loginWithGoogle, signIn } from "@/services/auth/authService";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await signIn(email);
        if (!user) return null;

        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullname = user.fullname;
        token.phone = user.phone;
        token.role = user.role;
      }

      if (account?.provider === "google") {
        const data = {
          email: user.email,
          fullname: user.name ?? "",
          type: "google",
        };

        const res = await loginWithGoogle(data);
        token.id = res.id;
        token.email = res.email;
        token.fullname = res.fullname;
        token.role = res.role;
      }
      return token;
    },
    async session({ session, token }) {
      const customToken = token as {
        id: string;
        email: string;
        fullname: string;
        phone: string;
        role: string;
      };

      if (customToken) {
        session.user = {
          id: customToken.id,
          email: customToken.email,
          fullname: customToken.fullname,
          phone: customToken.phone,
          role: customToken.role,
        };
      }
      return session;
    },
  },
};
