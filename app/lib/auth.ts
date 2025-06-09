import  prisma  from '@/db';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }
  interface User extends DefaultUser {
    id: string;
    role: string;
  }
}

export const NEXT_AUTH_CONFIG: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: { label: 'Name', type: 'text' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' }, 
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials: any) {
        const { name, password, role } = credentials;

        if (!name || !password || !role) return null;
        
        if (role === 'admin') {
          const admin = await prisma.admin.findUnique({
            where: {name },
          });

          if (admin && admin.password === password) {
            return {
              id: String(admin.id),
              name: admin.name,
              role: 'admin',
            };
          }
        } else if (role === 'employee') {
          const Employee = await prisma.employee.findUnique({
            where: { name: name },
          });

          if (Employee && Employee.password === password) {
            return {
              id: String(Employee.id),
              name: Employee.name,
              role: 'employee',
            };
          }
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 1 day
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    async redirect({baseUrl }) {
     
      return `${baseUrl}/signin`;
    },
  },

  pages: {
    signIn: '/signin',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
