import * as mongodb from "mongodb";
 

//room chunks collection
export interface Room_c {
   _id: mongodb.ObjectId;
   files_id: mongodb.ObjectId;
   n: mongodb.NumericType;
   data: mongodb.Binary;
}