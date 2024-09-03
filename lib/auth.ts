import { sign, verify } from "jsonwebtoken";
import { compare } from "bcrypt";
import prisma from "@/prisma";

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

export const authenticateUser = async (username: string, password: string) => {
  const user = await prisma.account.findUnique({ where: { username } });
  if (!user) return null;

  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) return null;

  return { id: user.id, username: user.username };
};
