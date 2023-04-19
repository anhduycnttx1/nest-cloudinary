import { Module } from '@nestjs/common';
import { TigrisService } from './tigrisdata/tigris.provider';

@Module({
     imports: [],
     controllers: [],
     providers: [TigrisService],
     exports: [TigrisService]
})
export class DataModule { }
