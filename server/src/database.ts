import * as mongodb from "mongodb";
import { Employee } from "./employee";


const sqlite3 = require('sqlite3').verbose();



export const collections: {
    //employees is the type and collection is the way it is
    //stored in the db
    employees?: mongodb.Collection<Employee>;
    game?: Array<JSON>;
    db_data?: {employees: any, game: any};

} = {};


export async function connectToDB(uri:string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();
    


    let sdb = new sqlite3.Database('../game.db', (err : Error) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the game database.');

       asv_game(sdb);
        
    });


    //name of the databse on mongodb that holds, employee collection
    const db = client.db("testdb");
    await asv_emp(db);



    //db holding collection of employees 
    const employeesCollection = db.collection<Employee>("employees");
    collections.employees = employeesCollection;

    const gameTable = await game_getTable(sdb);
    collections.game = gameTable;

    const db_data = {
        employees: await collections.employees.find({}).toArray(),
        game: collections.game
    }
    

    collections.db_data = db_data

    console.log(collections.db_data)

    



    await new Promise<void>((resolve,reject) => {

        sdb.close((err: Error) => {
            if (err) {
              reject(err);
            }
            resolve();
            console.log('game database closed for now!');
        });
    })


    //get the game collection


    
}

//update existing collectoin with json schema validation so we
//know our documents will always match the shape of our employee
//model, even if added elsewhere

//might have to create validation for the different data
//that is saved to the database collections
//applySchemaValdiation = asv


async function asv_game(sdb: typeof sqlite3.Database){
    sdb.serialize(() => {
        
        sdb.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, 'PLAYERS', (err: Error, data: JSON) => {
            if(err){
                console.log(err.message);
            }
            
            if(data){
                
                console.log(data);
            }
            else{
                sdb.prepare(`CREATE TABLE IF NOT EXISTS PLAYERS (UID INTEGER PRIMARY KEY, X INTEGER, Y INTEGER)`).run().finalize();
                console.log("game table doesn't exist")
                init_game(sdb)
            }

        });
    
    });

}


async function game_getTable(sdb: typeof sqlite3.Database){
    var table;

    await new Promise((resolve,reject) => {
        sdb.all(`SELECT * FROM PLAYERS`, [], (err:Error, rows: Array<JSON>) => {
            if (err) {
              reject(err);
            }

            resolve(rows);

            table = rows;     
        });

    })

    console.log("game table retrieved")



    return table;


}

async function init_game(sdb: typeof sqlite3.Database){

    sdb.serialize(() => {

        sdb.run('INSERT INTO PLAYERS(UID, X, Y) VALUES(?, ?, ?)', [73,0,0], (err: Error) => {
            if(err) {
                return console.log(err.message); 
            }
        });
        sdb.run('INSERT INTO PLAYERS(UID, X, Y) VALUES(?, ?, ?)', [47,11,43], (err: Error) => {
            if(err) {
                return console.log(err.message); 
            }
        });
        sdb.run('INSERT INTO PLAYERS(UID, X, Y) VALUES(?, ?, ?)', [37,7,0], (err: Error) => {
            if(err) {
                return console.log(err.message); 
            }
        });
    })

    console.log("game table initialized")

    





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


    //do same here with sqlite

 }


 


