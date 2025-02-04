import jwt, { type SignOptions, type Secret } from 'jsonwebtoken';
import { User } from '../models/User';


export class JwtService {
  private readonly secretKey: string;
  private readonly expiresIn: string;
  private readonly request: Request;

  constructor(request: Request) {
    this.secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    this.request = request;
  }

  /**
   * Generates a JWT token for a given user
   * @param user - The user object to include in the token
   * @returns string JWT token
   */
  generateToken(user: User): string {
    const options: SignOptions = { expiresIn: this.expiresIn as jwt.SignOptions['expiresIn'] };
    return jwt.sign(
      {
        id: user.uuid,
        email: user.email,
        role: user.role?.name
      },
      this.secretKey as Secret,
      options
    );
  }

  /**
   * Verifies a JWT token
   * @param token - The JWT token to verify
   * @returns any Decoded token payload
   */
  verifyToken(token: string): any {
    return jwt.verify(token, this.secretKey as jwt.Secret);
  }

  /**
   * Retrieves the JWT token from the Authorization header
   * @param request - The Bun.Request object from the current request
   * @returns string JWT token
   * @throws Error if no token is found in the header
   */
  private getTokenFromHeader(request: Request): string {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token found in Authorization header');
    }
    return authHeader.split(' ')[1];
  }
  

  getBearerToken(): string {
    const token = this.getTokenFromHeader(this.request);
    return token;
  }

  /**
   * Gets the current user's ID from the decoded JWT token
   * @param request - The Bun.Request object from the current request
   * @returns string UUID of the current user
   * @throws Error if token is invalid or user ID is not found
   */
  getCurrentUserId(): string {
    const token = this.getTokenFromHeader(this.request);
    const decoded = this.verifyToken(token);
    
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      throw new Error('Invalid token or user ID not found');
    }

    return decoded.id;
  }
}