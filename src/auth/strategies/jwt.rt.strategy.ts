import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from 'passport-jwt';

import AUTH_CONFIG from '../config'
import { JwtPayload } from "../types";

@Injectable()
export class RTStrategy extends PassportStrategy(Strategy, AUTH_CONFIG.STRATEGIES.JWT_RT.NAME) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RTStrategy.extractJWTfromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: AUTH_CONFIG.STRATEGIES.JWT_RT.SECRET_OR_KEY,
      passReqToCallback: true
    })
  }

  private static extractJWTfromCookie(req: Request) {
    if (req.cookies && 'refresh_token' in req.cookies) {
      return req.cookies.refresh_token
    }
    return null
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies.refresh_token
    return {
      ...payload,
      refreshToken
    }

  }
}
