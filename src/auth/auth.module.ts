import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers';
import { ATStrategy, RTStrategy } from './strategies';
import { GithubStrategy } from './strategies/github.strategy';
import { AuthGithubController } from './controllers/auth.github.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { TokenService } from './services/token.service';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController, AuthGithubController],
  providers: [AuthService, PrismaService, TokenService, ATStrategy, RTStrategy, GithubStrategy],
})
export class AuthModule { }
