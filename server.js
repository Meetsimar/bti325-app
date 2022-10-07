/*************************************************************************
* BTI325– Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Meetsimar Kaur Student ID: 106510217 Date: 07/10/2022
*
* Your app’s URL (from Cyclic) : ______________________________________________
*
*************************************************************************/

var express = require("express");
var app = express();

var data = require("./data-service.js")

var path = require("path");
var HTTP_PORT = process.env.PORT || 8080

function expressoutput() {
    console.log(`Express http server listening on ${HTTP_PORT}`);
}

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "/views/home.html"))
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"))
});


app.get("/employees", (req, res) => {
    data.getAllEmployees().
        then((data) => { res.json(data); }).
        catch((err) => {
            console.log(err)
        });

});

app.get("/managers", function (req, res) {
    data.getManagers().
        then((data) => { res.json(data); }).
        catch((err) => {
            console.log(err)
        })
        ;
});

app.get("/departments", function (req, res) {
    data.getDepartments().
        then((data) => { res.json(data); }).
        catch((ex) => {
            console.log(ex)
        })
})

app.use(function (req, res) {
    res.status(404).send("Page not found");
})

data.initialize().then(() => { app.listen(HTTP_PORT, expressoutput()) }).catch(() => {
    console.log("unable to start server");
})
