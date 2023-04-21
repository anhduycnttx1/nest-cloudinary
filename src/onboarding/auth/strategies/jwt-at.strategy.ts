import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Unauthorized } from 'src/exception/http-exception';
import { AuthService } from '../auth.service';


@Injectable()
export class JwtAtStrategy extends PassportStrategy(Strategy, "jwt-at") {
     constructor(
          protected configService: ConfigService,
          private authService: AuthService
     ) {
          super({
               jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
               ignoreExpiration: false,
               secretOrKey: configService.get<string>('JWT_SECRET_AT'),
          });
     }

     public async validate(payload: any) {
          if (!payload.sub) {
               throw new Unauthorized();
          }
          const validate = await this.authService.validate(payload.sub)
          if (!validate) {
               throw new Unauthorized();
          }
          return payload;
     }
}