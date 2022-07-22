import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';

import AUTH_CONFIG from '../config'

export class ATStrategy extends PassportStrategy(Strategy, AUTH_CONFIG.STRATEGIES.JWT_AT.NAME) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AUTH_CONFIG.STRATEGIES.JWT_AT.SECRET_OR_KEY
    })
  }

  async validate(payload: any) {
    return {
      ...payload
    }
  }
}