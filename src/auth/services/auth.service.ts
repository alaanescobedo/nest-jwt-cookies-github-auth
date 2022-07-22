import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginDto, LogoutDto, RegisterDto } from '../dtos';
import { PrismaService } from './prisma.service';
import AUTH_CONFIG from '../config'
import { Response } from 'express';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) { }

  async localRegister(dto: RegisterDto, agent: string, res: Response) {

    const userExist = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })
    if (userExist) throw new BadRequestException(AUTH_CONFIG.ERRORS.USER_EXIST)

    const pwdHash = this.hashDataSync(dto.password)

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        pwd: pwdHash
      }
    })

    const tokens = this.generateToken({ email: newUser.email, userId: newUser.id })
    await this.storeRefreshToken(tokens.refreshToken, agent, newUser.id)
    this.saveTokenInCookie(res, tokens.refreshToken)

    return res.send({ access_token: tokens.accessToken })
  }
  async localLogin(dto: LoginDto, agent: string, res: Response) {

    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })
    if (!user) throw new BadRequestException(AUTH_CONFIG.ERRORS.WRONG_CREDENTIALS)

    const pwdMatch = this.compareDataSync(dto.password, user.pwd)
    if (!pwdMatch) throw new BadRequestException(AUTH_CONFIG.ERRORS.WRONG_CREDENTIALS)

    const tokens = this.generateToken({ email: user.email, userId: user.id })
    await this.storeRefreshToken(tokens.refreshToken, agent, user.id)
    this.saveTokenInCookie(res, tokens.refreshToken)

    return res.send({ access_token: tokens.accessToken })
  }
  async logout(dto: LogoutDto) {
    const token = await this.prisma.token.findUnique({
      where: {
        value: dto.rt
      }
    })

    if(!token) throw new ForbiddenException(AUTH_CONFIG.ERRORS.UNAUTHORIZED)
    
    await this.prisma.token.update({
      where: {
        value: dto.rt
      },
      data: {
        value: null,
      }
    })
  }
  async refresh(dto: RefreshTokenDto, res: Response) {
    const token = await this.prisma.token.findUnique({
      where: {
        value: dto.rt
      }
    })
    if (!token) throw new ForbiddenException(AUTH_CONFIG.ERRORS.UNAUTHORIZED)
    const user = await this.prisma.user.findUnique({
      where: {
        id: token.ownerId
      }
    })

    const tokens = this.generateToken({ userId: user.id, email: user.email })
    await this.storeRefreshToken(tokens.refreshToken, token.agent, user.id)
    this.saveTokenInCookie(res, tokens.refreshToken)
    return res.send({ access_token: tokens.accessToken })
  }


  async storeRefreshToken(refreshToken: string, agent: string, userId: string) {
    const tokenFinded = await this.prisma.token.findFirst({
      where: {
        agent,
        ownerId: userId,
      }
    })
    if (tokenFinded) {
      return this.prisma.token.update({
        where: {
          id: tokenFinded.id
        },
        data: {
          value: refreshToken,
        }
      })
    }

    await this.prisma.token.create({
      data: {
        value: refreshToken,
        agent,
        owner: {
          connect: {
            id: userId
          }
        }
      }
    })
  }
  generateToken(args: { userId: string, email: string }) {
    const accessToken = this.jwtService.sign({
      sub: args.userId,
      email: args.email
    }, {
      secret: AUTH_CONFIG.STRATEGIES.JWT_AT.SECRET_OR_KEY,
      expiresIn: AUTH_CONFIG.STRATEGIES.JWT_AT.EXPIRES_IN
    })

    const refreshToken = this.jwtService.sign({
      sub: args.userId,
    }, {
      secret: AUTH_CONFIG.STRATEGIES.JWT_RT.SECRET_OR_KEY,
      expiresIn: AUTH_CONFIG.STRATEGIES.JWT_RT.EXPIRES_IN
    })

    return { accessToken, refreshToken }
  }
  saveTokenInCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      // httpOnly: true,
      // signed: true,
      // maxAge: 1000 * 60 * 60 * 24 * 7,
      // sameSite: 'lax',
      // secure: false
    })
  }
  hashDataSync(data: string) {
    return bcrypt.hashSync(data, 10)
  }
  compareDataSync(data: string, encrypt: string) {
    return bcrypt.compareSync(data, encrypt)
  }
  validateToken(token: string, secret: string) {
    return this.jwtService.verify(token, { secret })
  }
}
