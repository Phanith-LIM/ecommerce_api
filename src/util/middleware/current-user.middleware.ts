import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async use(req: Request, _: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      req.currentUser = null;
      next();
      return;
    }

    try {
      const token = authHeader.split(' ')[1];
      const { id } = <JwtPayload>this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        ignoreExpiration: false,
      });
      req.currentUser = await this.usersService.findOne(+id);
      next();
    } catch (err) {
      req.currentUser = null;
      next();
    }
  }
}

interface JwtPayload {
  id: string;
}
