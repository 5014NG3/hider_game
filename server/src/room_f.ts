import * as mongodb from "mongodb";
 

//room files collection
export interface Room_f {
   _id: mongodb.ObjectId;
   length: mongodb.NumericType;
   chunkSize: mongodb.NumericType;
   uploadDate: mongodb.Timestamp;
   filename: string;
   metadata: any;
}