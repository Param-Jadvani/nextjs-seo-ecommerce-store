'use server';

import { generateToken, verifyToken } from '@/lib/auth';
import DBConnect from '@/lib/db';
import User from '@/model/User';
import { LoginSchema, SignupSchema } from '@/schema/auth';
import { UserType } from '@/types/user';
import { ZodError } from 'zod';
import { setCookie, removeCookie, getToken } from '@/lib/auth-cookie';

export async function signupAction(formData: FormData) {
  try {
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return { success: false, error: 'Invalid form data' };
    }

    const data = { username, email, password };
    const validatedData = SignupSchema.parse(data);

    await DBConnect();
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    const newUser = await User.create({
      username: validatedData.username,
      email: validatedData.email,
      password: validatedData.password,
    });

    const userForToken = {
      id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
    };

    const token = await generateToken(userForToken);
    await setCookie(token);

    return { success: true, user: userForToken };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.message,
      };
    } else if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An error occurred during registration.' };
  }
}

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
      return { success: false, error: 'Invalid credentials' };
    }

    const data = { email, password };
    const validatedData = LoginSchema.parse(data);

    await DBConnect();
    const user = await User.findOne({ email: validatedData.email }).select('+password');

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    if (!(await user.comparePassword(validatedData.password))) {
      return { success: false, error: 'Invalid credentials' };
    }

    const userForToken = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    };

    const token = await generateToken(userForToken);
    await setCookie(token);

    return { success: true, user: userForToken };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.message,
      };
    } else if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An error occurred during login.' };
  }
}

export async function logoutAction() {
  try {
    await removeCookie();
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
    return { success: false, error: 'Logout failed' };
  }
}

export async function getUserFromCookie(): Promise<UserType | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}
