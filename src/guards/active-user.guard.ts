import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SKIP_ACTIVE_CHECK_KEY } from '../common/decorators/skip-active-check.decorator';

@Injectable()
export class ActiveUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skipActiveCheck = this.reflector.getAllAndOverride<boolean>(SKIP_ACTIVE_CHECK_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipActiveCheck) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true;
    }

    if (user.isActive === false) {
      throw new ForbiddenException('Sua conta está desativada. Entre em contato com o suporte.');
    }

    return true;
  }
} 