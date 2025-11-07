import { Controller, Post, Body, Res, Get, UseGuards, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '../gemini/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google/login')
  async googleLogin(
    @Body('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { idToken } = await this.authService.exchangeCodeForTokens(code);

    // Set the ID token in a secure, HttpOnly cookie
    res.cookie('id_token', idToken, {
      httpOnly: true,
      secure: true, // Must be true when SameSite is 'None'
      sameSite: 'none',
      // expires: new Date(Date.now() + 3600 * 1000), // 1 hour
    });

    return { message: 'Login successful' };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    // The user object is attached to the request by the AuthGuard
    const userId = req.user.sub;
    this.authService.logout(userId);

    // Clear the cookie
    res.clearCookie('id_token');
    return { message: 'Logout successful' };
  }

  @Get('status')
  @UseGuards(AuthGuard)
  status() {
    // If the AuthGuard passes, the user is authenticated.
    return { isAuthenticated: true };
  }
}
