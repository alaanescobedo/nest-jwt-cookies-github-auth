import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { LoginDto, LogoutDto, RegisterDto } from '../dtos';
import AUTH_CONFIG from '../config'
import { Response } from 'express';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ValidateUserDto } from '../dtos/validate-user.dto';
import { UsersService } from 'src/users/services/users.service';
import { TokenService } from './token.service';
import { UserInfo } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) { }

  async register(dto: RegisterDto, userInfo: UserInfo, res: Response) {

    const user = await this.validateUser(dto)
    if (user) throw new BadRequestException(AUTH_CONFIG.ERRORS.USER_EXIST)

    const pwdHash = await this.hashData(dto.password)
    const newUser = await this.userService.create({ email: dto.email, password: pwdHash })

    const tokens = await this.tokenService.generateToken({ email: newUser.email, userId: newUser.id })
    await this.tokenService.storeRefreshToken({
      value: tokens.refreshToken,
      agent: userInfo?.agent,
      ownerId: newUser.id,
    }, res)

    return res.send({ access_token: tokens.accessToken })
  }
  async localLogin(dto: LoginDto, res: Response) {

    const user = await this.validateUser(dto)
    if (!user) throw new BadRequestException(AUTH_CONFIG.ERRORS.WRONG_CREDENTIALS)

    const tokens = await this.tokenService.generateToken({ email: user.email, userId: user.id })
    await this.tokenService.storeRefreshToken({ value: tokens.refreshToken, ownerId: user.id }, res)

    return res.send({ access_token: tokens.accessToken })
  }
  async logout(dto: LogoutDto) {
    const token = await this.tokenService.findOne(dto)
    if (!token) throw new ForbiddenException(AUTH_CONFIG.ERRORS.UNAUTHORIZED)

    await this.tokenService.updateOne({ id: token.id, value: null })
  }
  async refresh(dto: RefreshTokenDto, res: Response) {
    const token = await this.tokenService.findOne(dto)
    if (!token) throw new ForbiddenException(AUTH_CONFIG.ERRORS.UNAUTHORIZED)
    const user = await this.userService.findOneById(token.ownerId)
    if (!user) throw new NotFoundException(AUTH_CONFIG.ERRORS.USER_NOT_FOUND)

    const tokens = await this.tokenService.generateToken({ email: user.email, userId: user.id })
    await this.tokenService.storeRefreshToken({
      value: tokens.refreshToken,
      agent: token.agent,
      ownerId: user.id,
    }, res)

    return res.send({ access_token: tokens.accessToken })
  }

  async validateUser(dto: ValidateUserDto) {
    const user = await this.userService.findOne(dto);
    if (!user) return null

    const pwdMatch = await this.compareData(dto.password, user.password);
    if (!pwdMatch) return null

    return user;
  }
  async hashData(data: string) {
    const salt = await bcrypt.genSalt(AUTH_CONFIG.CRYPT.SALT_ROUNDS);
    return await bcrypt.hash(data, salt)
  }
  async compareData(data: string, encrypt: string) {
    return await bcrypt.compare(data, encrypt)
  }
}
