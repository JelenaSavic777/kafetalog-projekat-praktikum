import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

interface JwtPayload {
  id: string | number;
  username: string;
}

export function signJwt(payload: JwtPayload, expiresIn: string | number = JWT_EXPIRES_IN): string {
  const options: SignOptions = {
    expiresIn: expiresIn as any, 
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as JwtPayload;
  } catch (error) {
    return null;
  }
}
