import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export interface AuthTokenPayload extends JwtPayload {
  userId: string;
  role: "admin" | "participant";
}

const JWT_SECRET = process.env.JWT_SECRET ?? "";
const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN ?? "1h";
export const SESSION_DURATION = 60 * 60 * 24 * 7; // 1 hour in seconds

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions); //force SignOptions overload to avoid type errors
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
