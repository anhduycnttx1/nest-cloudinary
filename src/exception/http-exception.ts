import { HttpException, HttpStatus } from '@nestjs/common';

export enum HttpCode {
     OK = 200,
     BAD_REQUEST = 400,
     NOT_FOUND = 404,
     CONFLICT = 409,
     INTERNAL_SERVER = 500,
     UNAUTHENTICATED = 401,
     PERMISSION_DENIED = 403,
     BAD_GATEWAY = 502
}


export const successResponse = (data: any) => ({
     message: "success",
     httpCode: HttpCode.OK,
     data: data
})

export class BadGateway extends HttpException {
     constructor(message: string) {
          super(
               {
                    message: message,
                    httpCode: HttpCode.BAD_GATEWAY,
               },
               HttpStatus.OK
          );
     }
}
export class PermissionDenied extends HttpException {
     constructor(message: string) {
          super(
               {
                    message: message,
                    httpCode: HttpCode.PERMISSION_DENIED,
               },
               HttpStatus.OK
          );
     }
}

export class Unauthorized extends HttpException {
     constructor() {
          super(
               {
                    message: 'Unauthorized',
                    httpCode: HttpCode.UNAUTHENTICATED,
               },
               HttpStatus.OK
          );
     }
}

export class DataNotFound extends HttpException {
     constructor(message: string) {
          super(
               {
                    message: message,
                    httpCode: HttpCode.NOT_FOUND,
               },
               HttpStatus.OK
          );
     }
}

export class BadRequest extends HttpException {
     constructor(message: string) {
          super(
               {
                    message: message,
                    httpCode: HttpCode.BAD_REQUEST,
               },
               HttpStatus.OK
          );
     }
}