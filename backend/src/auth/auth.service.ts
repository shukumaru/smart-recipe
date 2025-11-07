import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private readonly oauthClient: OAuth2Client;
  // In-memory store for refresh tokens. !! NOT FOR PRODUCTION !!
  // In a real application, use a secure database.
  private refreshTokens: Map<string, string> = new Map();

  constructor() {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!googleClientId || !googleClientSecret) {
      throw new Error(
        'Google OAuth2 credentials are not set in environment variables.',
      );
    }

    this.oauthClient = new OAuth2Client(
      googleClientId,
      googleClientSecret,
      redirectUri,
    );
  }

  async exchangeCodeForTokens(code: string) {
    try {
      const { tokens } = await this.oauthClient.getToken(code);
      if (!tokens.id_token || !tokens.refresh_token) {
        throw new UnauthorizedException('Failed to retrieve tokens from Google.');
      }

      const ticket = await this.oauthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid token payload.');
      }

      // Store refresh token securely, associated with the user's ID
      this.refreshTokens.set(payload.sub, tokens.refresh_token);

      return { idToken: tokens.id_token, refreshToken: tokens.refresh_token };
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw new UnauthorizedException('Failed to exchange authorization code.');
    }
  }

  async refreshAccessToken(userId: string): Promise<string> {
    const refreshToken = this.refreshTokens.get(userId);
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token available.');
    }

    this.oauthClient.setCredentials({ refresh_token: refreshToken });

    try {
      const { credentials } = await this.oauthClient.refreshAccessToken();
      if (!credentials.id_token) {
        throw new UnauthorizedException('Failed to refresh ID token.');
      }
      return credentials.id_token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      // If refresh fails, the user might have revoked access.
      // Remove the stored refresh token.
      this.refreshTokens.delete(userId);
      throw new UnauthorizedException('Failed to refresh token.');
    }
  }

  logout(userId: string) {
    this.refreshTokens.delete(userId);
  }
}
