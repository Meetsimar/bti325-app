const { resolve } = require('dns');
var fs = require('fs');
var employees = [];
var departments = [];
var managers = [];
var empstatus = [];
var empdepart = [];
var empmanagenum = [];

exports.initialize = function () {
    return new Promise(function (resolve, reject) {
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


exports.getAllEmployees = function () {
    return new Promise(function (resolve, reject) {
        if (employees.length > 0) {
            resolve(employees);
        }
        else {
            reject("no results returned");
        };
    })
}

exports.getManagers = function () {
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

exports.getDepartments = function () {
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

//TODOOO
exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        if (typeof employeeData.isManager === "undefined") {
            employeeData.isManager = false;
        }
        else {
            employeeData.isManager = true;
        }

        employeeData.employeeNum = employees.length() + 1;
        employees[employees.length()] = employeeData;

        if (employeeData) resolve(employees);
        else reject("error adding post");
    })

}

exports.getEmployeesByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        if (employees.length > 0) {
            var x = 0;
            for (var i in employees) {
                if (employees[i].status == status) {
                    empstatus[x] = employees[i];
                    x++;
                }
            }
            resolve(empstatus);
        }
        else {
            reject("no results returned");
        };
    })
}

exports.getEmployeesByDepartment = function (department) {
    return new Promise((resolve, reject) => {
        if (employees.length > 0) {
            var x = 0;
            for (var i in employees) {
                if (employees[i].department == department) {
                    empdepart[x] = employees[i];
                    x++;
                }
            }
            resolve(empdepart);
        }
        else {
            reject("no results returned");
        };
    })
}

exports.getEmployeesByManager = function (manager) {
    return new Promise((resolve, reject) => {
        if (employees.length > 0) {
            var x = 0;
            for (var i in employees) {
                if (employees[i].employeeManagerNum == manager) {
                    empmanagenum[x] = employees[i];
                    x++;
                }
            }
            resolve(empmanagenum);
        }
        else {
            reject("no results returned");
        };
    })
}

exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        if (employees.length > 0) {
            for (var i in employees) {
                if (employees[i].employeeNum == num) {
                    index = i;
                }
            }
            resolve(employees[index]);
        }
        else {
            reject("no results returned");
        };
    })
}

exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        if (employees.length > 0) {
            for (var i in employees) {
                if (employees[i].SSN == employeeData.SSN) {
                    employees[i].firstName = employeeData.firstName;
                    employees[i].lastName = employeeData.lastName;
                    employees[i].email = employeeData.email
                    employees[i].SSN = employeeData.SSN
                    employees[i].addressStreet = employeeData.addressStreet
                    employees[i].addressCity = employeeData.addressCity
                    employees[i].addressState = employeeData.addressState
                    employees[i].addressPostal = employeeData.addressPostal
                    employees[i].isManager = employeeData.isManager
                    employees[i].employeeManagerNum = employeeData.employeeManagerNum
                    employees[i].status = employeeData.status
                    employees[i].department = employeeData.department
                    employees[i].hireDate = employeeData.hireDate                    
                }
            }
            resolve();
        }
        else {
            reject("no results returned");
        }
    })
}
