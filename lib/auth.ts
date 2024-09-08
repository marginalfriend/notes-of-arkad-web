import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);
const REFRESH_SECRET = new TextEncoder().encode(process.env.REFRESH_SECRET as string);

export const generateTokens = async (user: { id: string; username: string }) => {
  const accessToken = await new SignJWT({ id: user.id, username: user.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m') // Short-lived access token
    .sign(JWT_SECRET);

  const refreshToken = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d') // Longer-lived refresh token
    .sign(REFRESH_SECRET);

  return { accessToken, refreshToken };
};

export const generateAccessToken = async (userId: string, username: string) => {
  return await new SignJWT({ id: userId, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(JWT_SECRET);
};

export const verifyAccessToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { id: string; username: string };
  } catch (error) {
    console.error('Access token verification failed:', error);
    return null;
  }
};

export const verifyRefreshToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload as { id: string };
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
};
