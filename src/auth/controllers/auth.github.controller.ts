import { Controller, Get, HttpCode, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services';
import AUTH_CONFIG from '../config'
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators';
import { UserAgent } from '../decorators/user-agent.decorator';
import { GithubGuard } from '../guards/github.guard';
import { Profile } from 'passport-github2';
import { PrismaService } from '../services/prisma.service';

@Controller(AUTH_CONFIG.ROUTES.ROOT)
export class AuthGithubController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) { }

  @Public()
  @Get(AUTH_CONFIG.ROUTES.GITHUB)
  async githubAuth() { } // Init the github auth flow

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(GithubGuard)
  @Get(AUTH_CONFIG.ROUTES.GITHUB_CALLBACK)
  async githubCallback(@CurrentUser() user: Profile, @UserAgent() agent: string, @Res() res: Response) {

    const userExist = await this.prisma.user.findFirst({
      where: {
        email: user.emails[0].value
      }
    })
    if (userExist) {
      // TODO: Create a jwtauth Service to put this logic in
      const tokens = this.authService.generateToken({
        email: user.emails[0].value,
        userId: userExist.id
      })
      await this.authService.storeRefreshToken(tokens.refreshToken, agent, userExist.id)
      this.authService.saveTokenInCookie(res, tokens.accessToken)
      return res.json({ access_token: tokens.accessToken })
    }

    return this.authService.localRegister({
      email: user.emails[0].value,
      password: user.id
    },
      agent,
      res)
  }

}
