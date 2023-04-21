
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/shared/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DataModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAtStrategy } from './strategies/jwt-at.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
     imports: [UserModule, DataModule, PassportModule, ConfigModule, JwtModule.register({})],
     controllers: [AuthController],
     providers: [AuthService, JwtAtStrategy],
     exports: []
})
export class AuthModule { }
