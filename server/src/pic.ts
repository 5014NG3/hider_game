import * as mongodb from "mongodb";
 
export interface Pic {
   name: string;
   imagePath: string;
   _id?: mongodb.ObjectId;
}