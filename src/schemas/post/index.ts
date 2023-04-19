import {
     Field,
     PrimaryKey,
     TigrisCollection,
     TigrisDataTypes,
} from "@tigrisdata/core";



@TigrisCollection("posts")
export class PostSchema {
     @PrimaryKey(TigrisDataTypes.INT64, { order: 1, autoGenerate: true })
     id?: string;

     @Field()
     title: string;

}