import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  findAll() { }

  findOne(user: Partial<User>) {
    return this.prisma.user.findFirst({
      where: {
        username: user.username,
        email: user.email
      }
    })
  }
  findOneById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  async create(dto: CreateUserDto) {
    return await this.prisma.user.create({ data: dto })
  }

  update(id: number, user: any) { }

  delete(id: number) { }
}
