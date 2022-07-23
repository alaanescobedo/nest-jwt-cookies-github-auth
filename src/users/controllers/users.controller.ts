import { Controller } from '@nestjs/common';
import USERS_CONFIG from '../config';

@Controller(USERS_CONFIG.ROUTES.ROOT)
export class UsersController {}
