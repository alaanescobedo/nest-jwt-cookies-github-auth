import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers';
import { PrismaService } from './services/prisma.service';
import { ATStrategy, RTStrategy } from './strategies';
import { GithubStrategy } from './strategies/github.strategy';
import { AuthGithubController } from './controllers/auth.github.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController, AuthGithubController],
  providers: [AuthService, PrismaService, ATStrategy, RTStrategy, GithubStrategy],
})
export class AuthModule { }
