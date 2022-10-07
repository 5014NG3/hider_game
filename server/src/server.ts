import * as dotenv from "dotenv";
//connect/express middleware
import cors from "cors";
import express from "express";
import {connectToDB} from "./database";
import {employeeRouter} from "./employee.routes";
import bodyParser from "body-parser"

import { Socket} from "socket.io";

const sqlite3 = require('sqlite3').verbose();


export const user_id: {
    //employees is the type and collection is the way it is
    //stored in the db\
    values?: JSON;

} = {};









//load env variables from the .env file, where 
//the ATLAS_URI is configed


async function getUID(ip: any) {

    let sdb = await new sqlite3.Database('../game.db', (err : Error) => {
        if (err) {
          console.error(err.message);
        }    
        
    });
    

    var player = JSON


    await new Promise((resolve,reject) => {
        sdb.get(`SELECT * FROM CONNECTIONS WHERE IP = ?`, ip, (err: Error, data: JSON) => {
            if (err) {
            
                reject(err);
            }

            resolve(data);

            player = data;    
             
        });

    })

    return player
    
}

async function setUID(ip:String,uid: String) {
    let sdb = await new sqlite3.Database('../game.db', (err : Error) => {
        if (err) {
          console.error(err.message);
        }

        
    });

    await sdb.run('INSERT INTO CONNECTIONS(IP, UID, LOBBY) VALUES(?, ?, ?)', [ip,uid,69420], (err: Error) => {
        if(err) {
            return console.log(err.message); 

        }

    });
    
}



connectToDB()
    .then( () => {
        const app = express();
        const http = require('http').createServer(app);
        const io = require('socket.io')(http, {
            cors: {
                origins: ['http://localhost:4200/employees']
            }
        })

        app.use(bodyParser.json())
        app.use(cors());

        io.on('connection', async (socket: Socket) => {
            var address = String(socket.handshake.address);
            //console.log(socket)

            var user_uid = await getUID(address)

            if(user_uid){
                user_id.values = user_uid
                
            }
            else{
                const new_uid = Math.random().toString(36).substring(2, 15);
                await setUID(address,new_uid)
                user_uid = await getUID(address)
                user_id.values = user_uid

            }

            //socket.id





            socket.on('disconnect', ()  => {
                console.log( user_uid["UID" as keyof JSON] + ' disconnected')
                console.log(socket.id + " dcd")


            });




            socket.on('user message', (msg) => {
                console.log('users message: ' + msg);
                //io.emit('server msg', `server received ur meessage: ${msg}`);
                //console.log(String(user_id.values["IP" as keyof JSON]))
                //io.emit('server msg', user_id.values)
                io.to(socket.id).emit('server msg', user_id.values)

                console.log("received: " + socket.id)
            })

            socket.on('user update', (msg) => {
                console.log('users that updated: ' + msg);
                //io.emit('server msg', `server received ur meessage: ${msg}`);
                //console.log(String(user_id.values["IP" as keyof JSON]))
                //io.emit('server msg', user_id.values)
                io.emit('server update', user_id.values["UID" as keyof JSON])

                console.log("received: " + socket.id)
            })




        });
        
        //use the endpoints
        app.use("/employees", employeeRouter);
        //TODO








        


        //start the Express server
        http.listen(5200, () => {
            console.log('Server running at http://localhost:5200...')
            
        });





    }).catch(error => console.error(error));

