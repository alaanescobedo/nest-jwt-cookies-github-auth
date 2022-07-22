import { Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import AUTH_CONFIG from '../config'

@Injectable()
export class GithubGuard extends AuthGuard(AUTH_CONFIG.STRATEGIES.GITHUB.NAME) {}