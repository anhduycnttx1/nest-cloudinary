
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from 'src/shared/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DataModule } from 'src/database/database.module';


@Module({
     imports: [UserModule, DataModule, JwtModule.register({})],
     controllers: [AuthController],
     providers: [AuthService],
     exports: []
})
export class AuthModule { }
