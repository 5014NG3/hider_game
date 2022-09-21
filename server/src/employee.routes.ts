import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
const sqlite3 = require('sqlite3').verbose();

export const employeeRouter = express.Router();
employeeRouter.use(express.json());

//'GET /employees' endpoint, gets all employees in the db
// route is '/' because we'll register all endpoints from this 
//file under the '/employees' route

async function getPlayersHelper(sdb: typeof sqlite3.Database){
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

    //console.log("game table retrieved")



    return table;


}

employeeRouter.get("/", async (_req, res) => {
    try {
        //find method b/c passing in an empty object {} we'll get 
        //all employees in the db

        let sdb = await new sqlite3.Database('../game.db', (err : Error) => {
            if (err) {
              console.error(err.message);
            }    
            
        });

        

        const send_db = {
            employees: await collections.employees.find({}).toArray(),
            game: await getPlayersHelper(sdb)

            
            
            //game: await collections.game
            //previous value which i assumed was correct however this makes the database hold
            //the state when the server was first launched not when operation where applied 
            //to it


        }



        res.status(200).send(send_db);



    } 
    catch (error){
        res.status(500).send(error.message);
    }

});


//'GET /employees/:id' endpoint allows get single employee by ID.

employeeRouter.get("/:id", async(req,res) => {

    //? - optional chaining operator, enables you to read value
    //of nested property without throwing an error if the property
    //doesn't exist, instead of error, expression evaluates to 
    //undefined


    try {
        //id provided as parameter
        const id = req?.params?.id;
        //ObjectId method used to convert string ID to MongoDB
        //ObjectId object
        //const query = {_id: new mongodb.ObjectId(id)};
        //use findOne method to find employee with given ID
        //const employee = await collections.employees.findOne(query);
        //console.log(id)
        //console.log("a")


        let sdb = await new sqlite3.Database('../game.db', (err : Error) => {
            if (err) {
              console.error(err.message);
            }    
            
        });

        //console.log("b")
        

        var player = JSON


        await new Promise((resolve,reject) => {
            sdb.get(`SELECT * FROM PLAYERS WHERE UID = ?`, id, (err: Error, data: JSON) => {
                if (err) {
                
                    reject(err);
                }

                resolve(data);

                player = data;    
                 
            });

        })
    
        //console.log("game table retrieved")

        //console.log(player['NAME' as keyof JSON ])
    
    
        console.log(player)


        // id fond
        if(player){
            //res.status(200).send(employee);
            res.status(200).send(player);

        }

        //id not found
        else {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    }
    catch (error){
        res.status(404).send(`Failed to find an employeeeeeeeee: ID ${req?.params?.id}`);
    }

});

//'POST /employees' endpoint allow create new employee

employeeRouter.post("/",async (req,res) => {
    //receive employee object from the client in request body
    try {
        //access data ins string/JSON object from the client side
        const employee = req.body;
        //insert to collections, receive, insertOne method , inserts
        //employee to the db, if success, send 201 Created with ID of 
        //employee, o/w send 500 Internal Server Error

        //this is where the random id is created

        const new_uid = Math.random().toString(36).substring(2, 10);
        //console.log("dweeb")

        //relic
        //console.log(req.body['name' as keyof JSON])

        //inserting same values to the sqlite database

        let sdb = await new sqlite3.Database('../game.db', (err : Error) => {
            if (err) {
              console.error(err.message);
            }
    
            
        });

        await sdb.run('INSERT INTO PLAYERS(UID, NAME, POSITION, LEVEL) VALUES(?, ?, ?, ?)', [new_uid,employee['name' as keyof JSON],employee['position' as keyof JSON], employee['level' as keyof JSON]], (err: Error) => {
            if(err) {
                return console.log(err.message); 
            }
            res.status(201).send(`Created a new employee: ID ${new_uid}`);

        });


        /*
        const result = await collections.employees.insertOne(employee);


        if(result.acknowledged){
            
            
            res.status(201).send(`Created a new employee: ID ${result.insertedId}`);
        }
        else{
            res.status(500).send("Failed to create a new employee.");
        }
        */

    }
    catch (error){
        console.error(error);
        res.status(400).send(error.message);
    }

});

// 'PUT /employees/:id' endpoint allows to update existing employee


employeeRouter.put("/:id", async(req,res) => {
    try {

        //req is client side, ? cause field to evaulate to undefined
        //if the id field doesn't exist in the nested body
        const id = req?.params?.id;
        const employee = req.body;

        //convert to mongodb object
        const query = {_id: new mongodb.ObjectId(id)};

        let sdb = await new sqlite3.Database('../game.db', (err : Error) => {
            if (err) {
              console.error(err.message);
            }
    
            
        });

        await sdb.run('UPDATE PLAYERS SET NAME = ?, POSITION = ?, LEVEL = ? WHERE UID = ?', [employee['name' as keyof JSON],employee['position' as keyof JSON], employee['level' as keyof JSON], id], (err: Error) => {
            if(err) {
                return console.log(err.message); 
            }
            res.status(200).send(`Updated an employee: ID ${id}.`);
        });
        



        //use updateOne to update the employee with the corresponding
        //id, if success send 200 Ok response
        /*
        const result = await collections.employees.updateOne(query, {$set: employee});

        if (result && result.matchedCount){
            res.status(200).send(`Updated an employee: ID ${id}.`);
        }
        else if (!result.matchedCount){
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
        else {
            res.status(304).send(`Failed to update an employee: ID ${id}`);
        }
        */

    }
    catch (error){
        console.error(error.message);
        res.status(400).send(error.message);
    }

});


//'DELETE /employees/:id' endpoint allow delete an existing employee.

employeeRouter.delete("/:id", async(req,res) => {

    try{
        //evaulate to undefined if id isn't present
        const id = req?.params?.id;
        //convert to mongodb object
        //const query = {_id: new mongodb.ObjectId(id)};
        //deleteOne method to delete employee with the id
        
        
        let sdb = await new sqlite3.Database('../game.db', (err : Error) => {
            if (err) {
                console.error(err.message);
            }
            
            
        });
        
        await sdb.run('DELETE FROM PLAYERS WHERE UID = ?', [id], (err: Error) => {
            if(err) {
                return console.log(err.message); 
            }
            res.status(202).send(`Removed an employee: ID ${id}`);
        });
        
        //result.deletedCount == 0 means employee isn't found
        /*
        const result = await collections.employees.deleteOne(query);

        if (result && result.deletedCount){
            res.status(202).send(`Removed an employee: ID ${id}`);
        }
        else if(!result){
            res.status(400).send(`Failed to remove an employee: ID ${id}`);
        }
        else if(!result.deletedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
        */
        
    }
    catch(error){
        console.error(error.message);
        res.status(400).send(error.message);
    }

});