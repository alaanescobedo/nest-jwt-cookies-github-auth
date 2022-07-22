import { AuthGuard } from "@nestjs/passport"
import AUTH_CONFIG from '../config'

export class RTGuard extends AuthGuard(AUTH_CONFIG.STRATEGIES.JWT_RT.NAME) {
  constructor() {
    super()
  }
}