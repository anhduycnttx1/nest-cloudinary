import {
     Field,
     PrimaryKey,
     TigrisCollection,
     TigrisDataTypes,
} from "@tigrisdata/core";



@TigrisCollection("wallets")
export class WalletSchema {
     @PrimaryKey(TigrisDataTypes.INT64, { order: 1, autoGenerate: true })
     id?: string;

     @Field()
     name: string;

}