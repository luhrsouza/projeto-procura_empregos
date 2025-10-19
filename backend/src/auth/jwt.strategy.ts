import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenBlocklist } from './entities/token-blocklist.entity';
import { Repository } from 'typeorm';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(TokenBlocklist)
    private tokenBlocklistRepository: Repository<TokenBlocklist>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SEU_SEGREDO_SUPER_SECRETO',
      passReqToCallback: true,
    });
  }

  async validate(req: RequestType, payload: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }
    const token = authHeader.split(' ')[1];
    const isBlocked = await this.tokenBlocklistRepository.findOne({ where: { token } });
    if (isBlocked) {
      throw new UnauthorizedException({ message: 'Invalid token' });
    }

    return { userId: payload.sub, username: payload.username };
  }
}