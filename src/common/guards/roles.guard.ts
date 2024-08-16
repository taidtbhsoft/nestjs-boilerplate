import type {CanActivate, ExecutionContext} from '@nestjs/common';
import {Injectable} from '@nestjs/common';

import {UserEntity} from '../../modules/user/user.entity';
import {LanguageCode, RoleType} from '../constants';
import {ContextProvider} from '../providers';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roles: RoleType[] = []) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;
    // Set current user
    ContextProvider.setAuthUser(user);
    // Set current Language
    const language: LanguageCode = request.headers['x-language-code'];
    if (LanguageCode[language]) {
      ContextProvider.setLanguage(language);
    }
    if (!this.roles?.length) {
      return true;
    }

    return this.roles.includes(user.role);
  }
}
