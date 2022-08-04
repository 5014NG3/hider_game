import * as dotenv from "dotenv";
//connect/express middleware
import cors from "cors";
import express from "express";
import {connectToDB} from "./database";
import {employeeRouter} from "./employee.routes"

//load env variables from the .env file, where 
//the ATLAS_URI is configed
dotenv.config();

const {ATLAS_URI} = process.env;

if(!ATLAS_URI) {
    console.error("No ATLAS_URI env variable has been defined in config.env");
    process.exit(1);
}

connectToDB(ATLAS_URI)
    .then(() => {
        const app = express();
        app.use(cors());

        //use the endpoints
        app.use("/employees", employeeRouter);


        //start the Express server
        app.listen(5200, () => {
            console.log('Server running at http://localhost:5200...')
        });
    }).catch(error => console.error(error));