import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly client: OAuth2Client;
  private readonly googleClientId: string;

  constructor() {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      throw new Error('GOOGLE_CLIENT_ID is not set in environment variables.');
    }
    this.googleClientId = googleClientId;
    this.client = new OAuth2Client(this.googleClientId);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found.');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException(
        'Invalid authorization header format. Format is: Bearer <token>',
      );
    }

    const token = parts[1];

    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.googleClientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid token: payload is missing.');
      }

      // Attach user payload to the request object for future use
      request.user = payload;

      return true;
    } catch (error) {
      console.error('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid token or token expired.');
    }
  }
}
