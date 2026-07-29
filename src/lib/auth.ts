import { UserType } from "@/types/user";
import { SignJWT, jwtVerify, JWTPayload } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d";

if (!JWT_SECRET) {
    throw new Error("Please define the JWT_SECRET environment variable inside .env.local");
}

export async function generateToken(payload: UserType & JWTPayload): Promise<string> {
    const secretKey = new TextEncoder().encode(JWT_SECRET);

    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(secretKey);

    return token;
}

export async function verifyToken(token: string): Promise<UserType | null> {
    if (!token) {
        console.log("verifyToken: No token provided.");
        return null;
    }

    try {
        const secretKey = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify<UserType>(token, secretKey);

        if (!payload.id || !payload.email || !payload.username) {
            console.error("Token verification succeeded but payload missing essential fields.");
            return null;
        }

        return payload;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Token verification failed:", error.name, "-", error.message);
        } else {
            console.error("Token verification failed with unknown error:", error);
        }
        return null;
    }
}
