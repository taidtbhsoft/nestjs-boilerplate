import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { UserEntity } from '../../modules/user/user.entity';
import type { RoleType } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roles: RoleType[] = []) {}

  canActivate(context: ExecutionContext): boolean {
    if (!this.roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: UserEntity }>();
    const user = request.user;

    return this.roles.includes(user.role);
  }
}
