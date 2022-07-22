import { ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthGuard } from "@nestjs/passport"
import { Observable } from "rxjs"
import AUTH_CONFIG from '../config'

@Injectable()
export class ATGuard extends AuthGuard(AUTH_CONFIG.STRATEGIES.JWT_AT.NAME) {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const key = this.reflector.getAllAndOverride(AUTH_CONFIG.METADATA.IS_PUBLIC.KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if(key === AUTH_CONFIG.METADATA.IS_PUBLIC.VALUE) return true
    return super.canActivate(context)
  }
}