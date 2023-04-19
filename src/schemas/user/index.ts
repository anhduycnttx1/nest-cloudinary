import {
     Field,
     PrimaryKey,
     SearchField,
     TigrisCollection,
     TigrisDataTypes,
} from "@tigrisdata/core";



@TigrisCollection("users")
export class UserSchema {
     @PrimaryKey(TigrisDataTypes.UUID, { order: 1, autoGenerate: true })
     id?: string;

     @SearchField()
     @Field()
     username: string;

     @Field()
     hash: string;

     @SearchField()
     @Field()
     email: string;

     @SearchField()
     @Field()
     displayName?: string;

     @Field()
     refreshToken?: string;

     @Field({ timestamp: "createdAt" })
     createdAt?: Date;

     @Field({ timestamp: "updatedAt" })
     updatedAt?: Date;
}