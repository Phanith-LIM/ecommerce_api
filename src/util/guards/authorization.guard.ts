import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
  ForbiddenException,
} from '@nestjs/common';

export const AuthorizationGuard = (allowedRoles: string[]): Type<CanActivate> => {
  @Injectable()
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const result = request?.currentUser?.role.map((role: string) => allowedRoles.includes(role)).find((val: boolean)=> val === true);
      if(result) return true;
      throw new ForbiddenException('Not authorized');
    }
  }
  return mixin(RolesGuardMixin);
};
