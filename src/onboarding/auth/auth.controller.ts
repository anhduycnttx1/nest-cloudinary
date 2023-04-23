
import { Body, Controller, Get, Post, HttpCode, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
     constructor(private authService: AuthService) { }

     @HttpCode(200)
     @Post('register')
     async register(@Body() registerDto: RegisterDto): Promise<any> {
          return await this.authService.register(registerDto)
     }

     @HttpCode(200)
     @Post('auth-with-password')
     async authWithPassword(@Body() loginDto: LoginDto): Promise<any> {
          return await this.authService.login(loginDto)
     }

     @HttpCode(200)
     @Post('auth-refresh')
     async authRefresh(@Body("refreshToken") refreshToken: string): Promise<any> {
          return await this.authService.refreshToken(refreshToken)
     }

     @HttpCode(200)
     @Get('auth-info')
     @UseGuards(JwtAuthGuard)
     async getMe(@Req() req: Request): Promise<any> {
          const user = req.user;
          return await this.authService.getMe(user['sub'])
     }

     @HttpCode(200)
     @Get('logout')
     @UseGuards(JwtAuthGuard)
     async logoutAuth(@Req() req: Request): Promise<any> {
          const user = req.user;
          return await this.authService.logout(user['sub'])
     }


}