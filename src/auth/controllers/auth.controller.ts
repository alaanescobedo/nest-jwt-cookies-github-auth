import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services';
import AUTH_CONFIG from '../config'
import { LoginDto, RegisterDto } from '../dtos';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators';
import { RTGuard } from '../guards';
import { CurrentUserInfo } from '../decorators/current-user-info';
import { userInfo } from 'os';
import { UserInfo } from '../types';
console.log('userInfo', userInfo);

@Controller(AUTH_CONFIG.ROUTES.ROOT)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post(AUTH_CONFIG.ROUTES.LOCAL_REGISTER)
  async register(@Body() dto: RegisterDto, @CurrentUserInfo() userInfo: UserInfo, @Res() res: Response) {
    return this.authService.register(dto, userInfo, res);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post(AUTH_CONFIG.ROUTES.LOCAL_LOGIN)
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    return this.authService.localLogin(dto, res);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RTGuard)
  @Post(AUTH_CONFIG.ROUTES.LOGOUT)
  async logout(@CurrentUser() user: any) {
    console.log({ user });
    return this.authService.logout({ value: user['refreshToken'] });
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RTGuard)
  @Post(AUTH_CONFIG.ROUTES.REFRESH)
  async refresh(@CurrentUser() user: any, @Res() res: Response) {
    return this.authService.refresh({ value: user['refreshToken'] }, res);
  }
}
