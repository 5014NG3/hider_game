import { Employee } from "./employee";


const sqlite3 = require('sqlite3').verbose();



export const collections: {
    //employees is the type and collection is the way it is
    //stored in the db
    employees?: {};
    game?: Array<JSON>;

} = {};


export async function connectToDB() {
    //const client = new mongodb.MongoClient(uri);
    //await client.connect();
    


    let sdb = new sqlite3.Database('../game.db', (err : Error) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the game database.');

       asv_game(sdb);
        
    });


    //name of the databse on mongodb that holds, employee collection
    //const db = client.db("testdb");
    //await asv_emp(db);



    //db holding collection of employees 
    //const employeesCollection = db.collection<Employee>("employees");
    collections.employees = {};


    const gameTable = await game_getTable(sdb);
    collections.game = gameTable;





    



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
                sdb.prepare(`CREATE TABLE IF NOT EXISTS PLAYERS (UID TEXT PRIMARY KEY, NAME TEXT, POSITION TEXT, LEVEL TEXT)`).run().finalize();
                console.log("game table doesn't exist")
                //init_game(sdb)
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








 


