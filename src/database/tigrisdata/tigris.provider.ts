import { Injectable, OnModuleInit } from '@nestjs/common';
import { Tigris } from '@tigrisdata/core';
import { PostSchema } from 'src/schemas/post';
import { UserSchema } from 'src/schemas/user';


@Injectable()
export class TigrisService extends Tigris implements OnModuleInit {
     async onModuleInit() {
          const tigrisClient = new Tigris();
          // ensure branch exists, create it if it needs to be created dynamically
          await tigrisClient.getDatabase().initializeBranch();
          // register schemas
          await tigrisClient.registerSchemas([PostSchema, UserSchema]);
     }

}