import dotenv from 'dotenv';
import type { Secret, SignOptions } from 'jsonwebtoken';

dotenv.config();

function requiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const config: {
    port: number;
    jwtSecret: Secret;
    jwtExpiresIn: SignOptions['expiresIn'];
    cookieName: string;
    cookieMaxAge: number;
    nodeEnv: string;
} = {
    port: Number(process.env.PORT) || 8000,
    jwtSecret: requiredEnv('JWT_SECRET'),
    jwtExpiresIn: (process.env.JWT_EXPIRES_IN || '1h') as SignOptions['expiresIn'],
    cookieName: process.env.AUTH_COOKIE_NAME || 'token',
    cookieMaxAge: Number(process.env.COOKIE_MAX_AGE) || 3600000,
    nodeEnv: process.env.NODE_ENV || 'development',
};