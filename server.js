/*************************************************************************
* BTI325– Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source.
* (including 3rd party web sites) or distributed to other students.
*
* Name: Meetsimar Kaur Student ID: 106510217 Date: 08/11/2022
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


app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.render("addImage", { layout: "main" });
})

app.get('/', function (req, res) {
    res.render("home", { layout: "main" })
});

app.get("/about", (req, res) => {
    res.render("about", { layout: "main" })
});


app.get("/employees", (req, res) => {

    if (req.query.status) {

        data.getEmployeesByStatus(req.query.status).then(data => {
            if (data.length > 0) { res.render("employees", { employee: data }) }
            else { res.render("employees", { message: "no results" }) }
        }).catch(err => {
            res.render({ message: "No results" });
        })
    }

    else if (req.query.department) {

        data.getEmployeesByDepartment(req.query.department).then(data => {
            if (data.length > 0) { res.render("employees", { employee: data }) }
            else { res.render("employees", { message: "no results" }) }
        }).catch(err => {
            res.render({ message: "no results" });
        })
    }

    else if (req.query.manager) {

        data.getEmployeesByManager(req.query.manager).then(data => {
            if (data.length > 0) { res.render("employees", { employee: data }) }
            else { res.render("employees", { message: "no results" }) }
        }).catch(err => {
            res.render({ message: "no results" });
        })
    }

    else {

        data.getAllEmployees()
            .then((data) => {
                if (data.length > 0) { res.render("employees", { employee: data }); }
                else { res.render("employees", { message: "no results" }) }
            }).catch(() => res.render({ message: "no results" }))

    }

});


app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    data.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(data.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});

app.post("/employee/update", (req, res) => {
    data.updateEmployee(req.body)
        .then(() => { res.redirect("/employees"); })
});

app.get("/departments", function (req, res) {
    data.getDepartments().
        then((data) => {
            if (data.length > 0) res.render("departments", { departments: data });
            else res.render("departments", { message: "no results" })
        }).
        catch(() => {
            res.render({ message: "no results" });
        })
})

app.post("/employees/add", (req, res) => {
    data.addEmployee(req.body)
        .then(() => res.redirect("/employees"))
        .catch((err) => res.json({ "message": err }))
});

app.get("/employees/add", (req, res) => {
    data.getDepartments()
        .then(function (data) { res.render("addEmployee", { departments: data }) })
        .catch(() => res.render("addEmployee", { departments: [] }))
})

app.get("/departments/add", (req, res) => {
    res.render("addDepartment");
})

app.post("/departments/add", (req, res) => {
    data.addDepartment(req.body)
        .then(() => res.redirect('/departments'))
        .catch((err) => res.json({ "message": err }))
});
app.get("/images/add", (req, res) => {
    res.render("addImage");
})

app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", (err, items) => {
        res.render("image", { data: items });
    })
})

app.post("/departments/update", (req, res) => {
    data.updateDepartment(req.body)
        .then(res.redirect("/departments"))
        .catch((err) => res.json({ "message": err }))
});

app.get("/department/:departmentId", (req, res) => {
    data.getDepartmentById(req.params.departmentId).then(data => {
        if (data.length > 0) res.render("department", { department: data })
        else { res.status(404).send("Department Not Found"); }
    }).catch(() => {
        res.status(404).send("Department Not Found");
    })
})

app.get("/employees/delete/:empNum", (req, res) => {
    data.deleteEmployeeByNum(req.params.empNum)
        .then(() => res.redirect("/employees"))
        .catch(() => res.status(500).send("Unable to Remove Employee / Employee not found"))
})
app.use(function (req, res) {
    res.status(404).send("Page not found");
})

data.initialize().then(() => { app.listen(HTTP_PORT, expressoutput()) }).catch(() => {
    console.log("unable to start server");
})


// app.get("/managers", function (req, res) {
//     data.getManagers().
//         then((data) => { res.json(data); }).
//         catch((err) => {
//             console.log(err)
//         });
// })
