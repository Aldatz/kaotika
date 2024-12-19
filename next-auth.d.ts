import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken: string;
    refreshToken: string;
    email: string;
  }
  interface JWT {
    email?: string;
    accessToken?: string;
  }
}