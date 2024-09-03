import { sign, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (user: { id: string; username: string }) => {
  return sign(user, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  try {
    return verify(token, JWT_SECRET) as { id: string; username: string };
  } catch (error) {
    return null;
  }
};
