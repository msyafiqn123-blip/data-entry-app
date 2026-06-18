import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        // For first time setup: if no user exists at all, we can allow a default admin login
        // But let's create a seed script or allow an auto-create admin if DB is completely empty.
        if (!user) {
           const count = await prisma.user.count();
           if (count === 0 && credentials.username === "admin" && credentials.password === "admin") {
              const hashedPassword = await bcrypt.hash("admin", 10);
              const newAdmin = await prisma.user.create({
                 data: {
                    username: "admin",
                    password: hashedPassword,
                    role: "ADMIN"
                 }
              });
              return { id: newAdmin.id, username: newAdmin.username, role: newAdmin.role };
           }
           return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          username: user.username,
          role: user.role,
          kodeKecamatan: user.kodeKecamatan,
          kodeKelurahan: user.kodeKelurahan,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        // @ts-ignore
        token.kodeKecamatan = user.kodeKecamatan;
        // @ts-ignore
        token.kodeKelurahan = user.kodeKelurahan;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        // @ts-ignore
        session.user.kodeKecamatan = token.kodeKecamatan as string | null;
        // @ts-ignore
        session.user.kodeKelurahan = token.kodeKelurahan as string | null;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};
