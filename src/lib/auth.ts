import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const adminPassword = process.env.ADMIN_PASSWORD;
        if (
          adminPassword &&
          credentials.email === "hi@nicholaus.ai" &&
          credentials.password === adminPassword
        ) {
          return {
            id: "1",
            email: "hi@nicholaus.ai",
            name: "Admin",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname === "/admin/login";

      if (isOnAdmin) {
        if (isOnLogin) {
          if (isLoggedIn) {
            return Response.redirect(new URL("/admin", nextUrl));
          }
          return true;
        }
        return isLoggedIn;
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
