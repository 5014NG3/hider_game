import * as mongodb from "mongodb";
import { Employee } from "./employee";

export const collections: {
    //employees is the type and collection is the way it is
    //stored in the db
    employees?: mongodb.Collection<Employee>;
} = {};

export async function connectToDB(uri:string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();


    //name of the databse on mongodb that holds, employee collection
    const db = client.db("testdb");
    await applySchemaValidation(db);


    //db holding collection of employees 
    const employeesCollection = db.collection<Employee>("employees");
    collections.employees = employeesCollection;
    
}

//update existing collectoin with json schema validation so we
//know our documents will always match the shape of our employee
//model, even if added elsewhere

//might have to create validation for the different data
//that is saved to the database collections
async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            //fields that are saved
            required: ["name", "position", "level"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                position: {
                    bsonType: "string",
                    description: "'position' is required and is a string",
                    minLength: 5
                },
                level: {
                    bsonType: "string",
                    description: "'level' is required and is one of 'junior', 'mid', or 'senior'",
                    enum: ["junior", "mid", "senior"],
                },
            },
        },
    };
  
    // Try applying the modification to the collection, if the collection doesn't exist, create it
   await db.command({
        collMod: "employees",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection("employees", {validator: jsonSchema});
        }
    });
 }



