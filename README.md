---
title: MEAN Stack template application
Author: Agon Gashi (agonxgashi)
Tags: MEAN Stack application template
---

# MEAN-template
**A simple (MongoDB, Express, Angular, Node) application template that works.**

This simple template is meant to be used as a starting point for your next super-big MEAN Aplication. It is very easy to run and the comments should make every line of code I've written understandable (if not, feel free to propose changes 😉). It uses a minimum number of npm packages that are crucial to make the application work. Used packages are described below.

### Downloaded from npm

+ **express**: *Express is a minimal and flexible Node.js web application
framework that provides a robust set of features for web and mobile applications.*
+ **mongoose**: *Mongoose provides a straight-forward, schema-based solution to
model your application data. It includes built-in type casting, validation,
query building, business logic hooks and more, out of the box.*
+ **path**: *The path module provides utilities for working with file and
directory paths.*


### Folder structure

+ **/src**: *Angular app created using ```angular/cli```.*
+ **/repo**: *Contains mongoose Schemas*
+ **/server**: *Files to be used on server-side*
    * **/routes**: *Declared routes to be imported on ```index.js```*
+ **/license**: *Feel free to use. Repo comes with MIT license* 😎
+ **/index.js**: *File that is used to start the node server*


### Usage

+ Prerequisites
    + **[Node.js & npm](https://nodejs.org/en/download/)**: *Please be sure you have installed Node.js and npm module on your computer before running the application*
    + **[MongoDB](https://www.mongodb.com/download-center)**: *Download & Install MongoDB, and make sure it's running on the default port (27017).*
    + **[AngularCLI](https://cli.angular.io/)**: *Is used to build front-end application.*
+ Be sure you have started MongoDB service before running the application
+ Navigate on project folder
+ Run ```ng build``` to generate Angular necessary files. Output files are by default created on ```/dist``` subfolder
+ Now run ```node index.js``` This is the last step and if everything goes right, the server will start listening for requests
+ You can open your browser and navigate to localhost:3000 to see if the application works

___

### Server notes

MEAN stack

MongoDB, document database
Express, a Node.js framework for building APIs
Angular, front-end application framework
Node.js, server-side JS runtime env

client(angular) <-> server(express, Node.js) <-> database(MongoDB Atlas)

/server/src/employee.ts is the employee object in the db

/server/src/database.ts connecting to the db

/server/src/.env uri to connect to MongoDB atlas with credentials

/server/src/server.ts is the entry point, load env vars, connect to db,
then start server

run app using with npx ts-node src/server.ts


<-                      Server ^ Client v                                  ->

building RESTful API

GET, POST, PUT, AND DELETE -> corresponds to CRUD
CREATE,READ,UPDATE, AND DELETE

here we are using two 'GET' end points one for getting 
all employees and one for getting a single employee by ID

to implement the endpoints, use the router provided by Express

/server/src/employee.routes.ts

then register the routes, instruct Express server to use routes we've 
defined, import the employeeRouter at /server/src/server.ts

import { employeeRouter } from "./employee.routes";

restart server after adding the endpoints

npx ts-node src/server.ts

Angular web app - interacts with our RESTful API. use Angular CLI
to scaffold the app. to install it use npm install -g @angular/cli 
at root of file

navigate to root directory, 
run 'ng new client --routing --style=css --minimal '
to scaffold a new Angular application

this creates new Angular app in 'client' directory
--routing flag generate routing module.
--style=css enable CSS preprocessory
--minimal skip any testing config

do cd client, then ng serve -o

in /client/src/index.html is where Bootstrap is added for styling

//create an employee interface on the client side 

command: ng generate interface employee

creates it under /client/src/app/employee.ts

^ presentation logic

angular recommends separating business logic from youn presentation logic , we'll create a service that handles all communication with the
'/employee' endpoint of the API, service will be used by the components of the app. 

to generate this service use : ng generate service employee

this create the service under: /client/src/app/employee.service.ts

^ business logic

create page for table of employees. In angular a component is a reusable piece of code that can be used to display a view. Create a new component called EmployeesList and then also register it as the '/employees' route in the app

to generate this run: ng generate component employees-list

Angular CLI generated a new component named EmployeesList in the 
'/client/src/app/employees-list/employees-list.component.ts'

the command also declared the component in the 'AppModule' , we don't have to do it manuualy

employees-list.component is a typescript class decorated with the @Component decorator, used to indicate that this class is a component. selector property used to specify the HTML tag that will be used to display this component, the selector isn't used at all, register the component as a route. template property is used to specify the HTML template this component

need to register these actions as a route in /client/src/app/app.routing.module.ts


create a page for adding employees

commmand: ng generate component employee-form -m app

import ReactiveFormsModule in AppModule
within /client/src/app/app.module.ts

use Angular's FormBuilder in /client/src/app/employee-form/employee-form.component.ts

next is to implement AddEmployeeComponent

command: ng generate component add-employee -m app
makes: /client/src/app/add-employee/add-employee.component.ts

this uses the EmployeeForm, whenever the AddEmployeeComponent 
receives a form submission, it calls the EmployeeService to create
the employee. the EmployeeService will emit an event when the 
employee is created and the AddEmployeeComponent will navigate back to the table of employees.

implement a component for editing an employee

command: ng generate component edit-employee -m app
makes: /client/src/app/edit-employee/edit-employee.component.ts

add navigation to our new pages in /client/src/app/app-routing.module.ts
 { path: 'employees/new', component: AddEmployeeComponent }, // <-- add this line
 { path: 'employees/edit/:id', component: EditEmployeeComponent }]; // <-- add this line