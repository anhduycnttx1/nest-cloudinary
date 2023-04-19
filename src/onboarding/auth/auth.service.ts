import { Session } from '@tigrisdata/core';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2'

import { BadGateway, BadRequest, successResponse } from 'src/exception/http-exception';
import { UserService } from './../../shared/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { IFToken } from 'src/interfaces';
import { LoginDto } from './dto/login.dto';
import { TigrisService } from 'src/database/tigrisdata/tigris.provider';
import { UserSchema } from 'src/schemas/user';

@Injectable()
export class AuthService {
     constructor(
          private tigrisService: TigrisService,
          private readonly jwtService: JwtService,
          private readonly userService: UserService,
     ) { }

     private db = this.tigrisService.getDatabase()

     async register(registerDto: RegisterDto): Promise<any> {
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
          const token = await this.generateToken({ email: createdUser.email, username: createdUser.username, sub: createdUser.id })
          return successResponse({ id: createdUser.id, email: createdUser.email, token })
     }

     async login(loginDto: LoginDto): Promise<any> {
          const { password, email } = loginDto
          if (!password || !email) throw new BadRequest("Email or password is required")
          let user: UserSchema
          user = await this.userService.getUserBy({ email: email })
          if (!user) throw new BadRequest(`Incorrect email or password`)
          const compare = await this.comparePassword(user.hash, password)
          if (!compare) throw new BadRequest(`Incorrect email or password`)
          const token = await this.generateToken({ email: user.email, username: user.username, sub: user.id })
          return successResponse({ id: user.id, email: user.email, token })
     }

     private async comparePassword(hashed: string, password: string,) {
          return await argon.verify(hashed, password);
     }

     private async generateToken(payload: any): Promise<IFToken> {
          try {
               const accessToken = await this.jwtService.signAsync(payload, { secret: 'at-secret', expiresIn: '15m' });
               const refreshToken = await this.jwtService.signAsync(payload, { secret: 'rt-secret', expiresIn: '7d' });
               return { accessToken, refreshToken };
          } catch (err) {
               throw new BadGateway("Generate token failed: " + err.message)
          }
     }

}