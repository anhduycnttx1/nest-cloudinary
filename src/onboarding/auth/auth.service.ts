import { Session } from '@tigrisdata/core';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2'

import { BadGateway, BadRequest, PermissionDenied, Unauthorized, successResponse } from 'src/exception/http-exception';
import { UserService } from './../../shared/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { IFToken } from 'src/interfaces';
import { LoginDto } from './dto/login.dto';
import { TigrisService } from 'src/database/tigrisdata/tigris.service';
import { UserSchema } from 'src/schemas/user';

@Injectable()
export class AuthService {
     logger: Logger
     constructor(
          private configService: ConfigService,
          private tigrisService: TigrisService,
          private readonly jwtService: JwtService,
          private readonly userService: UserService,
     ) {
          this.logger = new Logger(AuthService.name)
     }

     private db = this.tigrisService.getDatabase()
     private JWT_SECRET_AT = this.configService.get<string>('JWT_SECRET_AT')
     private JWT_SECRET_RT = this.configService.get<string>('JWT_SECRET_RT')

     async register(registerDto: RegisterDto): Promise<any> {
          try {
               const { password, email, username, displayName } = registerDto
               if (!password || !email) throw new BadRequest("Email or password is required")
               let createdUser: UserSchema
               await this.db.transact(async (tx: Session) => {
                    const usernameGen = username || "user" + Date.now().toString().slice(3)
                    const user = await this.userService.getUserBy({ email: email }, tx)
                    if (!!user) throw new BadRequest(`Author with email ${email} already exists`)
                    const hash = await argon.hash(password)
                    createdUser = await this.userService.create({ username: usernameGen, email, hash, displayName }, tx);
                    if (createdUser === undefined) throw new BadGateway("Failed to create user in the database")
               })
               this.logger.log(`User:: ${createdUser.email} :: Created successful`)
               const tokens = await this.generateToken({ email: createdUser.email, username: createdUser.username, sub: createdUser.id })
               const hashRt = await argon.hash(tokens.refreshToken)
               await this.userService.updateUserBy({ id: createdUser.id }, { refreshToken: hashRt })
               return successResponse({ id: createdUser.id, email: createdUser.email, tokens })
          } catch (err) {
               throw new BadGateway("Database error: " + err.message)
          }
     }

     async login(loginDto: LoginDto): Promise<any> {
          try {
               const { password, email } = loginDto
               if (!password || !email) throw new BadRequest("Email or password is required")
               const user = await this.userService.getUserBy({ email: email })
               if (!user) throw new BadRequest(`Incorrect email or password`)
               const compare = await this.comparePassword(user.hash, password)
               if (!compare) throw new BadRequest(`Incorrect email or password`)
               this.logger.log(`User:: ${user.email} :: Login successful`)
               const tokens = await this.generateToken({ email: user.email, username: user.username, sub: user.id })
               const hashRt = await argon.hash(tokens.refreshToken)
               await this.userService.updateUserBy({ id: user.id }, { refreshToken: hashRt })
               return successResponse({ id: user.id, email: user.email, tokens })
          } catch (err) {
               throw new BadGateway("Database error: " + err.message)
          }
     }

     async getMe(userId: string): Promise<any> {
          try {
               const user = await this.userService.getUserBy({ id: userId })
               if (!user) throw new PermissionDenied("You are not authorized to perform this action")
               return successResponse({ isAuthenticated: true, id: user.id, email: user.email })
          } catch (err) {
               throw new BadGateway("Database error: " + err.message)
          }
     }

     async logout(userId: string): Promise<any> {
          try {
               const user = await this.userService.getUserBy({ id: userId })
               if (!user) throw new PermissionDenied("You are not authorized to perform this action")
               await this.userService.updateUserBy({ id: user.id }, { refreshToken: null })
               return successResponse({ isAuthenticated: false, id: user.id, email: user.email })
          } catch (err) {
               throw new BadGateway("Database error: " + err.message)
          }
     }

     async validate(id: string): Promise<boolean> {
          const user = await this.userService.getUserBy({ id })
          return !!user
     }

     async refreshToken(rt: string): Promise<any> {
          try {
               const payload = await this.jwtService.verify(rt, { secret: this.JWT_SECRET_RT })
               const user = await this.userService.getUserBy({ id: payload["sub"] })
               if (!user) throw new Unauthorized()
               const compare = await this.compareToken(user.refreshToken, rt)
               if (!compare) throw new Unauthorized()
               const tokens = await this.generateToken({ email: user.email, username: user.username, sub: user.id })
               const hashRt = await argon.hash(tokens.refreshToken)
               await this.userService.updateUserBy({ id: user.id }, { refreshToken: hashRt })
               return successResponse({ id: user.id, email: user.email, token: tokens })
          }
          catch (error: any) {
               this.logger.error(error.message)
               throw new BadRequest("Token error: " + error.message)
          }
     }

     private async comparePassword(hashed: string, password: string,) {
          return await argon.verify(hashed, password);
     }
     private async compareToken(hashedRt: string, rt: string,) {
          return await argon.verify(hashedRt, rt);
     }

     private async generateToken(payload: any): Promise<IFToken> {
          try {
               const accessToken = await this.jwtService.signAsync(payload, { secret: this.JWT_SECRET_AT, expiresIn: '5m' });
               const refreshToken = await this.jwtService.signAsync(payload, { secret: this.JWT_SECRET_RT, expiresIn: '7d' });
               return { accessToken, refreshToken };
          } catch (err) {
               this.logger.error(err.message)
               throw new BadGateway("Generate token failed: " + err.message)
          }
     }
}