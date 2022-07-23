import { NotFoundException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from "src/users/services/users.service";

import AUTH_CONFIG from '../config'
import { JwtPayload } from "../types";

export class ATStrategy extends PassportStrategy(Strategy, AUTH_CONFIG.STRATEGIES.JWT_AT.NAME) {
  constructor(
    private readonly userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AUTH_CONFIG.STRATEGIES.JWT_AT.SECRET_OR_KEY
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findOneById(payload.sub)
    if(!user) throw new NotFoundException(AUTH_CONFIG.ERRORS.USER_NOT_FOUND)
    return user
  }
}