import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, StrategyOptions } from 'passport-github2'
import AUTH_CONFIG from '../config'


@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, AUTH_CONFIG.STRATEGIES.GITHUB.NAME) {
  constructor() {
    super({
      clientID: AUTH_CONFIG.STRATEGIES.GITHUB.CLIENT_ID,
      clientSecret: AUTH_CONFIG.STRATEGIES.GITHUB.SECRET,
      callbackURL: AUTH_CONFIG.STRATEGIES.GITHUB.CALLBACK_URL,
      scope: ['read:user']
    } as StrategyOptions)
  }

  async validate(at: string, rt: string, profile: Profile) {
    return profile;
  }
}