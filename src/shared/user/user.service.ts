import { Injectable } from '@nestjs/common';
import { Collection, Session, LogicalFilter } from '@tigrisdata/core';
import { BadGateway } from 'src/exception/http-exception';
import { UserSchema } from 'src/schemas/user';
import { TigrisService } from 'src/database/tigrisdata/tigris.provider';
type FilterUserOption = {
     email?: string,
     id?: string,
     username?: string,
}
@Injectable()
export class UserService {
     constructor(
          private tigrisService: TigrisService
     ) { }

     private userCollection: Collection<UserSchema> = this.tigrisService.getDatabase().getCollection<UserSchema>("users")

     async getListAndSearch(query?: { filter?: LogicalFilter<UserSchema>, sort?: any, options: any }, tx?: Session): Promise<UserSchema[]> {
          const userCursor = this.userCollection.findMany(query, tx)
          const result = await userCursor.toArray()
          return result
     }
     async getUserBy(filter: FilterUserOption, tx?: Session): Promise<UserSchema> {
          const result = await this.userCollection.findOne({
               filter: filter
          }, tx)
          return result
     }
     async create(data: UserSchema, tx?: Session): Promise<UserSchema> {
          try {
               return await this.userCollection.insertOne(data, tx)
          }
          catch (err) {
               throw new BadGateway("Database error: " + err.message)
          }
     }

}