import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.');
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password');

        if (!user || !user.password) {
          throw new Error('Invalid email or password.');
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordMatch) {
          throw new Error('Invalid email or password.');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatar_url || null,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) return false;

        await connectToDatabase();
        const emailLower = user.email.toLowerCase();

        let existingUser = await User.findOne({ email: emailLower });

        if (!existingUser) {
          existingUser = await User.create({
            name: user.name || 'Google User',
            email: emailLower,
            role: 'customer',
            avatar_url: user.image || null,
            provider: 'google',
          });
        } else {
          if (!existingUser.avatar_url && user.image) {
            existingUser.avatar_url = user.image;
            await existingUser.save();
          }
        }

        user.id = existingUser._id.toString();
        (user as unknown as { role: string }).role = existingUser.role;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role: string }).role;
      }

      if (token.email) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email.toLowerCase() }).lean();
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { id: string }).id = token.id as string;
        (session.user as unknown as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
