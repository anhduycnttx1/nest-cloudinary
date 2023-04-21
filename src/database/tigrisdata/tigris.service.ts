import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Tigris } from '@tigrisdata/core';
import { WalletSchema } from 'src/schemas/wallet';
import { UserSchema } from 'src/schemas/user';


@Injectable()
export class TigrisService extends Tigris implements OnModuleInit {
     logger: Logger
     constructor() {
          super()
          this.logger = new Logger(TigrisService.name)
     }

     async onModuleInit() {
          try {
               const tigrisClient = new Tigris();
               // ensure branch exists, create it if it needs to be created dynamically
               await tigrisClient.getDatabase().initializeBranch();
               // register schemas
               await tigrisClient.registerSchemas([WalletSchema, UserSchema]);
               this.logger.log("Database Tigris successfully started")
          }
          catch (error: any) {
               this.logger.error("Database Tigris: " + error.message)
          }
     }

}