import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import type { RoleType } from '../constants';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';

export function Auth(roles: RoleType[] = []): MethodDecorator {
  return applyDecorators(
    UseGuards(AuthGuard(), new RolesGuard(roles)),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
