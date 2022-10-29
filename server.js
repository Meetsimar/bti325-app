/*************************************************************************
* BTI325– Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source.
* (including 3rd party web sites) or distributed to other students.
*
* Name: Meetsimar Kaur Student ID: 106510217 Date: 28/10/2022
*
* Your app’s URL (from Cyclic Heroku) that I can click to see your application:
* https://fierce-river-57046.herokuapp.com/
*
*************************************************************************/ 

const express = require("express");
const app = express();
const multer = require("multer");
const fs = require('fs');
     
var data = require("./data-service.js")

var path = require("path");
var HTTP_PORT = process.env.PORT || 8080

function expressoutput() {
    console.log(`Express http server listening on ${HTTP_PORT}`);
}

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });

app.use(express.static('./public/'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/images/add', upload.single("imageFile"), (req, res) => {
    res.redirect('/images');
})

app.post('/employees/add', (req, res) => {
    data.addEmployee(req.body).
        then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
        })
    res.redirect('/employees');
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "/views/home.html"))
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"))
});


app.get("/employees", (req, res) => {

    if (req.query.status) {

        data.getEmployeesByStatus(req.query.status).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
        })
    }

    if (req.query.department) {

        data.getEmployeesByDepartment(req.query.department).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
        })
    }

    if (req.query.manager) {

        data.getEmployeesByManager(req.query.manager).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
        })
    }

    else
    {
        data.getAllEmployees().
            then((data) => { res.json(data); }).
            catch((err) => {
                console.log(err)
            });
    }
});

app.get('/employee/:value', (req, res) => {

    data.getEmployeeByNum(req.params.value).then(data => {
        res.json(data);
    }).catch(err => {
        console.log(err);
    })

})

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

app.get("/employees/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
})

app.get("/images/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
})

app.get('/images', (req, res) => {
    fs.readdir("./public/images/uploaded", (err, items) => {
        var images = items;
        res.json({ images });
    })
})

app.use(function (req, res) {
    res.status(404).send("Page not found");
})

data.initialize().then(() => { app.listen(HTTP_PORT, expressoutput()) }).catch(() => {
    console.log("unable to start server");
})
