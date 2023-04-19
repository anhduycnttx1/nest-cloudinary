import { Module } from '@nestjs/common';
import { DataModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { OnboardingModule } from './onboarding/onboarding.module';

@Module({
  imports: [
    DataModule,
    SharedModule,
    OnboardingModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.stag', '.env'],
    })
  ],
})

export class AppModule { }
