var fs = require('fs');
var employees = [];
var departments = [];
var managers = [];

exports.initialize = function(){
    return new Promise(function(resolve, reject) {
        fs.readFile('./data/employees.json', (err, data) => {
            if (err) {
                reject("Failure to read file employees.json!");
            }
            else {
                employees = JSON.parse(data);
                resolve(employees);
            }
        })

        fs.readFile('./data/departments.json', (err, data) => {
            if (err) {
                reject("Failure to read file departments.json!");
            }

            else {
                departments = JSON.parse(data);
                resolve(departments);
            }
        })

    })
}

exports.getAllEmployees = function(){
    return new Promise(function (resolve, reject) {
        if (employees.length > 0) {
            resolve(employees);
        }
        else {
            reject("no results returned");
        };
    })
}

exports.getManagers = function() {
    return new Promise(function (resolve, reject) {
        if (employees.length > 0) {
            var x = 0;
            for (var i in employees) {
                if (employees[i].isManager == true) {
                    managers[x] = employees[i];
                    x++;
                }
            }
            resolve(managers);
        }
        else {
            reject("no results returned");
        };
    }
    )
}

exports.getDepartments = function(){
    return new Promise(function (resolve, reject) {
        if (departments.length > 0) {
            resolve(departments);
        }
        else {
            reject("no results returned");
        };
    }
    )
}
