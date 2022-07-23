import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Response } from "express"
import { PrismaService } from "src/prisma/prisma.service"

import AUTH_CONFIG from '../config'

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) { }


  async findOne({ agent, value, ownerId }: { agent?: string, value?: string, ownerId?: string }) {
    return await this.prisma.token.findFirst({
      where: {
        value: value,
        ownerId: ownerId,
        agent: agent
      }
    })
  }

  async createOne({ agent, value, ownerId }: { agent?: string, value: string, ownerId: string }) {
    return await this.prisma.token.create({
      data: {
        value,
        agent,
        owner: {
          connect: {
            id: ownerId
          }
        }
      }
    })
  }

  async updateOne({ id, value }: { id: string, value: string }) {
    return await this.prisma.token.update({
      where: {
        id
      },
      data: {
        value
      }
    })
  }


  async generateToken(args: { userId: string, email: string }) {
    const accessToken = await this.jwtService.signAsync({
      sub: args.userId,
      email: args.email
    }, {
      secret: AUTH_CONFIG.STRATEGIES.JWT_AT.SECRET_OR_KEY,
      expiresIn: AUTH_CONFIG.STRATEGIES.JWT_AT.EXPIRES_IN
    })

    const refreshToken = await this.jwtService.signAsync({
      sub: args.userId,
    }, {
      secret: AUTH_CONFIG.STRATEGIES.JWT_RT.SECRET_OR_KEY,
      expiresIn: AUTH_CONFIG.STRATEGIES.JWT_RT.EXPIRES_IN
    })

    return { accessToken, refreshToken }
  }

  async storeRefreshToken({ agent, value, ownerId }: { agent?: string, value: string, ownerId: string }, res: Response) {
    const tokenFinded = await this.findOne({ agent, value, ownerId })

    if (tokenFinded) this.updateOne({ id: tokenFinded.id, value })
    else this.createOne({ agent, value, ownerId })

    res.cookie(AUTH_CONFIG.COOKIE.JWT_RT.NAME, value, AUTH_CONFIG.COOKIE.JWT_RT.CONFIG)
  }
}