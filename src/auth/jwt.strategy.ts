import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(jwt.Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate({ username }: JwtPayload): Promise<User> {
    const user: User = await this.usersRepository.findOne({ username });
    if (!user) {
      throw new UnauthorizedException();
    }
    delete user.password;
    return user;
  }
}
