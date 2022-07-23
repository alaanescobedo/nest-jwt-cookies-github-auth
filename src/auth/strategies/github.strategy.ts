import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, StrategyOptions } from 'passport-github2'
import { UsersService } from "src/users/services/users.service";
import AUTH_CONFIG from '../config'
import { AuthService } from "../services";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, AUTH_CONFIG.STRATEGIES.GITHUB.NAME) {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: AUTH_CONFIG.STRATEGIES.GITHUB.CLIENT_ID,
      clientSecret: AUTH_CONFIG.STRATEGIES.GITHUB.SECRET,
      callbackURL: AUTH_CONFIG.STRATEGIES.GITHUB.CALLBACK_URL,
      scope: AUTH_CONFIG.STRATEGIES.GITHUB.SCOPE
    } as StrategyOptions)
  }

  async validate(_at: string, _rt: string, profile: Profile) {
    const user = await this.usersService.findOne({ email: profile.emails[0].value })
    if (user) return user

    const pwdHash = await this.authService.hashData(profile.id)
    return await this.usersService.create({
      email: profile.emails[0].value,
      password: pwdHash, // Indifferent, we are not using it
      avatar: profile.photos[0].value,
      username: profile.username
    })
  }
}