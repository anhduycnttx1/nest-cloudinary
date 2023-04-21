import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Unauthorized } from 'src/exception/http-exception';

@Injectable()
export class AtAuthGuard extends AuthGuard('jwt-at') {
     canActivate(context: ExecutionContext) {
          return super.canActivate(context);
     }

     handleRequest(err: any, payload: any, info: any) {
          if (err || !payload) {
               throw err || new Unauthorized();
          }
          return payload;
     }
}
