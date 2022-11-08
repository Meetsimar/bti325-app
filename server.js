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
const { engine } = require("express-handlebars");

var data = require("./data-service.js")

var path = require("path");
const { mainModule } = require("process");

var HTTP_PORT = process.env.PORT || 8080

app.engine(".hbs", engine({
    extname: ".hbs",

    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
        },

        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            }
            else {
                return options.fn(this);
            }
        }

    }
}));

app.set("view engine", ".hbs");

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

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


app.post('/images/add', upload.single("imageFile"), (req, res) => {
    res.render("addImage", { layout: "main" });
})

app.post('/employees/add', (req, res) => {
    res.render("addEmployee", { layout: "main" })
});

app.get('/', function (req, res) {
    res.render("home", { layout: "main" })
});

app.get("/about", (req, res) => {
    res.render("about", { layout: "main" })
});


app.get("/employees", (req, res) => {

    if (req.query.status) {

        data.getEmployeesByStatus(req.query.status).then(data => {
            res.render("employees", { employee: data })
        }).catch(err => {
            res.render({ message: "no results" });
        })
    }

    if (req.query.department) {

        data.getEmployeesByDepartment(req.query.department).then(data => {
            res.render("employees",
                { employee: data })
        }).catch(err => {
            res.render({ message: "no results" });
        })
    }

    if (req.query.manager) {

        data.getEmployeesByManager(req.query.manager).then(data => {
            res.render("employees",
                { employee: data })
        }).catch(err => {
            res.render({ message: "no results" });
        })
    }

    data.getAllEmployees().then((data) => {
        res.render("employees", { employee: data, layout: "main" })
    }).catch(err => {
        res.render({ message: "no results" });
    });

});

app.get('/employee/:value', (req, res) => {

    data.getEmployeeByNum(req.params.value).then(data => {
        res.render("employee", { employee: data });
    }).catch(err => {
        res.render("employee", { message: "no results" });
    })

})

app.post("/employee/update", (req, res) => {
    data.updateEmployee(req.body).then(data => { res.redirect("/employees/"); })
});

// app.get("/managers", function (req, res) {
//     data.getManagers().
//         then((data) => { res.json(data); }).
//         catch((err) => {
//             console.log(err)
//         });
// });

app.get("/departments", function (req, res) {
    data.getDepartments().
        then((data) => {
            res.render("departments", {
                departments: data
            });
        }).
        catch((ex) => {
            res.render({ message: "no results" });
        })
})

app.get("/employees/add", (req, res) => {
    res.render("addEmployee");
})

app.get("/images/add", (req, res) => {
    res.render("addImage");
})

app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", (err, items) => {
        res.render("image", { data: items });
    })
})

app.use(function (req, res) {
    res.status(404).send("Page not found");
})

data.initialize().then(() => { app.listen(HTTP_PORT, expressoutput()) }).catch(() => {
    console.log("unable to start server");
})
