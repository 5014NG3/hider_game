import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
import { storage } from "./storage";
import { Pic } from "./pic";

export const picRouter = express.Router();
picRouter.use(express.json());


//'GET /pics' endpoint, gets all pics in the db
// route is '/' because we'll register all endpoints from this 
//file under the '/pics' route
picRouter.get("/", async (_req, res) => {
    try {
        //find method b/c passing in an empty object {} we'll get 
        //all pics in the db
        const pics = await collections.pics.find({}).toArray();
        res.status(200).send(pics);
    } 
    catch (error){
        res.status(500).send(error.message);
    }

});

//not necessary since images saved on the server side, todo modifiy to accomodate for getting from server side, or m
//might not even need to have this crud operation on this end of the code
//'GET /pics/:id' endpoint allows get single pic by ID.
/*
picRouter.get("/:id", async(req,res) => {

    //? - optional chaining operator, enables you to read value
    //of nested property without throwing an error if the property
    //doesn't exist, instead of error, expression evaluates to 
    //undefined

    try {
        //id provided as parameter
        const id = req?.params?.id;
        //ObjectId method used to convert string ID to MongoDB
        //ObjectId object
        const query = {_id: new mongodb.ObjectId(id)};
        //use findOne method to find pic with given ID
        const pic = await collections.pics.findOne(query);


        // id fond
        if(pic){
            res.status(200).send(pic);
        }

        //id not found
        else {
            res.status(404).send(`Failed to find an pic: ID ${id}`);
        }
    }
    catch (error){
        res.status(404).send(`Failed to find an pic: ID ${req?.params?.id}`);
    }

});
*/

//'POST /pics' endpoint allow create new pic

picRouter.post("/",storage,async (req,res) => {
    //receive pic object from the client in request body
    try {
        //access data ins string/JSON object from the client side
        const pic: Pic = {imagePath: 'http://localhost:5200/images/' + req.file.filename};
        //insert to collections, receive, insertOne method , inserts
        //pic to the db, if success, send 201 Created with ID of 
        //pic, o/w send 500 Internal Server Error
        const result = await collections.pics.insertOne(pic);

        if(result.acknowledged){
            res.status(201).send(`Created a new pic: ID ${result.insertedId}`);
        }
        else{
            res.status(500).send("Failed to create a new pic.");
        }

    }
    catch (error){
        console.error(error);
        res.status(400).send(error.message);
    }

});

// 'PUT /pics/:id' endpoint allows to update existing pic


picRouter.put("/:id", async(req,res) => {
    try {

        //req is client side, ? cause field to evaulate to undefined
        //if the id field doesn't exist in the nested body
        const id = req?.params?.id;
        const pic = req.body;

        //convert to mongodb object
        const query = {_id: new mongodb.ObjectId(id)};

        //use updateOne to update the pic with the corresponding
        //id, if success send 200 Ok response
        const result = await collections.pics.updateOne(query, {$set: pic});

        if (result && result.matchedCount){
            res.status(200).send(`Updated an pic: ID ${id}.`);
        }
        else if (!result.matchedCount){
            res.status(404).send(`Failed to find an pic: ID ${id}`);
        }
        else {
            res.status(304).send(`Failed to update an pic: ID ${id}`);
        }

    }
    catch (error){
        console.error(error.message);
        res.status(400).send(error.message);
    }

});


//'DELETE /pics/:id' endpoint allow delete an existing pic.
//not necessary since image is on server side
/*
picRouter.delete("/:id", async(req,res) => {

    try{
        //evaulate to undefined if id isn't present
        const id = req?.params?.id;
        //convert to mongodb object
        const query = {_id: new mongodb.ObjectId(id)};
        //deleteOne method to delete pic with the id
        const result = await collections.pics.deleteOne(query);

        //result.deletedCount == 0 means pic isn't found
        
        if (result && result.deletedCount){
            res.status(202).send(`REmoved an pic: ID ${id}`);
        }
        else if(!result){
            res.status(400).send(`Failed to remove an pic: ID ${id}`);
        }
        else if(!result.deletedCount) {
            res.status(404).send(`Failed to find an pic: ID ${id}`);
        }
        
    }
    catch(error){
        console.error(error.message);
        res.status(400).send(error.message);
    }

});
*/