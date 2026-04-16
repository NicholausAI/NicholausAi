import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Strapi",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Authenticate against Strapi
          const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            return null;
          }

          const data = await res.json();

          if (data.user) {
            return {
              id: String(data.user.id),
              email: data.user.email,
              name: data.user.username,
              jwt: data.jwt,
            };
          }

          return null;
        } catch {
          // Fallback to local admin password for development
          const adminPassword = process.env.ADMIN_PASSWORD;
          if (
            adminPassword &&
            credentials.email === "admin@nicholaus.ai" &&
            credentials.password === adminPassword
          ) {
            return {
              id: "1",
              email: "admin@nicholaus.ai",
              name: "Admin",
            };
          }
          return null;
        }
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
        token.jwt = (user as { jwt?: string }).jwt;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session as { jwt?: string }).jwt = token.jwt as string;
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
