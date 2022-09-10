import * as mongodb from "mongodb";
import { Employee } from "./employee";


const sqlite3 = require('sqlite3').verbose();



export const collections: {
    //employees is the type and collection is the way it is
    //stored in the db
    employees?: mongodb.Collection<Employee>;
} = {};


export async function connectToDB(uri:string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();
    


    let sdb = new sqlite3.Database('../game.db', (err : Error) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the game database.');

       game_emp(sdb);
        
    });







    sdb.close((err: Error) => {
        if (err) {
          console.error(err.message);
        }
        console.log('DB closed: Use in function that closes server or the sqlite3 db');
      });

    //name of the databse on mongodb that holds, employee collection
    const db = client.db("testdb");
    await asv_emp(db);



    //db holding collection of employees 
    const employeesCollection = db.collection<Employee>("employees");
    collections.employees = employeesCollection;


    
}

//update existing collectoin with json schema validation so we
//know our documents will always match the shape of our employee
//model, even if added elsewhere

//might have to create validation for the different data
//that is saved to the database collections
//applySchemaValdiation = asv


async function game_emp(sdb: typeof sqlite3.Database){
    sdb.run('INSERT INTO PLAYERS(UID, X, Y) VALUES(?, ?, ?)', [73,0,0], (err: Error) => {
        if(err) {
            return console.log(err.message); 
        }
        console.log('Row was added to the table: ${this.lastID}');
    });
    sdb.run('INSERT INTO PLAYERS(UID, X, Y) VALUES(?, ?, ?)', [47,11,43], (err: Error) => {
        if(err) {
            return console.log(err.message); 
        }
        console.log('Row was added to the table: ${this.lastID}');
    });


}



async function asv_emp(db: mongodb.Db) {
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


 


