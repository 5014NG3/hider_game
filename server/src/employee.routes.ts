import * as express from "express";
import * as mongodb from "mongodb";
import test from "node:test";
import { collections } from "./database";

export const employeeRouter = express.Router();
employeeRouter.use(express.json());

//'GET /employees' endpoint, gets all employees in the db
// route is '/' because we'll register all endpoints from this 
//file under the '/employees' route
employeeRouter.get("/", async (_req, res) => {
    try {
        //find method b/c passing in an empty object {} we'll get 
        //all employees in the db
        //const db_data = await collections.db_data;

        const send_db = {
            employees: await collections.db_data.employees.find({}).toArray(),
            game: await collections.db_data.game
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
        //console.log("id: " + id )
        //ObjectId method used to convert string ID to MongoDB
        //ObjectId object
        const query = {_id: new mongodb.ObjectId(id)};
        //console.log(query)
        //use findOne method to find employee with given ID
        //console.log(collections.employees)
        const employee = await collections.db_data.employees.findOne(query);
    


        // id fond
        if(employee){
            res.status(200).send(employee);
        }

        //id not found
        else {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    }
    catch (error){
        res.status(404).send(`Failed to find an employee: ID ${req?.params?.id}`);
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

        //console.log("id: " + Math.random().toString(36).substring(2, 5));

        const result = await collections.db_data.employees.insertOne(employee);
        console.log(result)

        if(result.acknowledged){
            res.status(201).send(`Created a new employee: ID ${result.insertedId}`);
        }
        else{
            res.status(500).send("Failed to create a new employee.");
        }

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

        //use updateOne to update the employee with the corresponding
        //id, if success send 200 Ok response
        const result = await collections.db_data.employees.updateOne(query, {$set: employee});

        if (result && result.matchedCount){
            res.status(200).send(`Updated an employee: ID ${id}.`);
        }
        else if (!result.matchedCount){
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
        else {
            res.status(304).send(`Failed to update an employee: ID ${id}`);
        }

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
        const query = {_id: new mongodb.ObjectId(id)};
        //deleteOne method to delete employee with the id
        const result = await collections.db_data.employees.deleteOne(query);

        //result.deletedCount == 0 means employee isn't found
        
        if (result && result.deletedCount){
            res.status(202).send(`REmoved an employee: ID ${id}`);
        }
        else if(!result){
            res.status(400).send(`Failed to remove an employee: ID ${id}`);
        }
        else if(!result.deletedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
        
    }
    catch(error){
        console.error(error.message);
        res.status(400).send(error.message);
    }

});