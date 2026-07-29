import { cookies } from 'next/headers';

export const AUTH_TOKEN = process.env.AUTH_TOKEN ?? 'authToken';

export const setCookie = async (token: string) => {
  (await cookies()).set(AUTH_TOKEN, token, {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 86400,
  });
};

export const getToken = async () => (await cookies()).get(AUTH_TOKEN)?.value;

export const removeCookie = async () => (await cookies()).delete(AUTH_TOKEN);
