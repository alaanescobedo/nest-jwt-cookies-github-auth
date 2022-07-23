import { Controller, Get, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import AUTH_CONFIG from '../config'
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators';
import { GithubGuard } from '../guards/github.guard';
import { User } from '@prisma/client';
import { TokenService } from '../services/token.service';
import { CurrentUserInfo } from '../decorators/current-user-info';
import { UserInfo } from '../types';

@Controller(AUTH_CONFIG.ROUTES.ROOT)
export class AuthGithubController {
  constructor(
    private readonly tokenService: TokenService,
  ) { }

  @Public()
  @Get(AUTH_CONFIG.ROUTES.GITHUB)
  async githubAuth() { } // Init the github auth flow

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(GithubGuard)
  @Get(AUTH_CONFIG.ROUTES.GITHUB_CALLBACK)
  async githubCallback(@CurrentUser() user: User, @CurrentUserInfo() userInfo: UserInfo, @Res() res: Response) {
    const tokens = await this.tokenService.generateToken({ email: user.email, userId: user.id })
    await this.tokenService.storeRefreshToken({
      value: tokens.refreshToken,
      agent: userInfo.agent,
      ownerId: user.id,
    }, res)
    return res.send({ access_token: tokens.accessToken })
  }
}
