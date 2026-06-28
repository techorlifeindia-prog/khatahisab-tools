import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/business.manage"
        }
      }
    }),
    CredentialsProvider({
      name: 'Demo Login',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@khatahisab.in" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Mock DB Check for Demo
        if (credentials?.email === "demo@khatahisab.in" && credentials?.password === "demo123") {
          return { id: "1", name: "Demo User", email: "demo@khatahisab.in" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
});

export { handler as GET, handler as POST };
