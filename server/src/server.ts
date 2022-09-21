import * as dotenv from "dotenv";
//connect/express middleware
import cors from "cors";
import express from "express";
import {connectToDB} from "./database";
import {employeeRouter} from "./employee.routes";
import bodyParser from "body-parser"

import { Socket} from "socket.io";






//load env variables from the .env file, where 
//the ATLAS_URI is configed

/*

const {ATLAS_URI} = process.env;

if(!ATLAS_URI) {
    console.error("No ATLAS_URI env variable has been defined in config.env");
    process.exit(1);
}
*/



connectToDB()
    .then(() => {
        const app = express();
        const http = require('http').createServer(app);
        const io = require('socket.io')(http, {
            cors: {
                origins: ['http://localhost:4200/employees']
            }
        })

        app.use(bodyParser.json())
        app.use(cors());

        
        //use the endpoints
        app.use("/employees", employeeRouter);
        //TODO

        io.on('connection', (socket: Socket) => {
            var address = socket.handshake.address;
            console.log('user ip: ' + address)
            console.log(socket.id + ' connected')
    

            socket.on('disconnect', () => {
                console.log(socket.id + ' disconnected')
            });


            socket.on('user message', (msg) => {
                console.log('users message: ' + msg);
                io.emit('server msg', `server received ur meessage: ${msg}`);
            })

        });


        //start the Express server
        http.listen(5200, () => {
            console.log('Server running at http://localhost:5200...')
        });





    }).catch(error => console.error(error));

