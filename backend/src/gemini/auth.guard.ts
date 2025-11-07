import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service'; // Assuming AuthService is in this path

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly client: OAuth2Client;
  private readonly googleClientId: string;

  constructor(private readonly authService: AuthService) {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      throw new Error('GOOGLE_CLIENT_ID is not set in environment variables.');
    }
    this.googleClientId = googleClientId;
    this.client = new OAuth2Client(this.googleClientId);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const cookies = (request.cookies ?? {}) as Record<
      string,
      string | undefined
    >;
    const token = cookies['id_token'];

    if (!token) {
      throw new UnauthorizedException('ID token not found in cookie.');
    }

    try {
      // First, try to verify the token
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.googleClientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid token: payload is missing.');
      }

      (request as any).user = payload;
      return true;
    } catch (error) {
      // If token verification fails, it might be expired. Try to refresh it.
      console.log('Token verification failed, attempting to refresh...');
      try {
        // We need the user ID (sub) to find the refresh token.
        // We can get it by decoding the expired token without verification.
        const payloadBase64 = token.split('.')[1];
        const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
        const decodedPayload = JSON.parse(decodedJson);
        const userId = decodedPayload.sub;

        if (!userId) {
          throw new UnauthorizedException('Cannot find user ID in token.');
        }

        const newIdToken = await this.authService.refreshAccessToken(userId);

        // Verify the new token to be sure
        const newTicket = await this.client.verifyIdToken({
          idToken: newIdToken,
          audience: this.googleClientId,
        });
        const newPayload = newTicket.getPayload();
        if (!newPayload) {
          throw new UnauthorizedException('Invalid new token payload.');
        }

        // Set the new token in the cookie
        response.cookie('id_token', newIdToken, {
          httpOnly: true,
          secure: true, // Must be true when SameSite is 'None'
          sameSite: 'none',
        });

        (request as any).user = newPayload;
        return true;
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError.message);
        // If refresh also fails, clear the cookie and throw unauthorized
        response.clearCookie('id_token');
        throw new UnauthorizedException('Invalid token and refresh failed.');
      }
    }
  }
}
