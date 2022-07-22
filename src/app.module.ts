import { Module, Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { ATGuard } from './auth/guards';


const ATProvider: Provider = {
  provide: APP_GUARD,
  useClass: ATGuard
}
const StaticModule = ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', 'client'),
})
@Module({
  imports: [AuthModule, StaticModule],
  providers: [ATProvider]
})
export class AppModule { }
