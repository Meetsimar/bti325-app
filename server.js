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
