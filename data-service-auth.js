const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

var uri = "mongodb+srv://simar:Atlas123@senecaweb.pvkyjrm.mongodb.net/?retryWrites=true&w=majority";

var userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{ "dateTime": Date, "userAgent": String }]
});

let User

exports.initialize = function () {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {

            if (err) {
                reject(err);
            }
            else {
                User = db.model("users", userSchema);
                console.log("connected to mongodb");
                resolve();
            }
        });
    })
}

exports.registerUser = function (userData) {
    return new Promise((resolve, reject) => {

        if (userData.password == "" || userData.password.trim().length == 0 || userData.password2 == "" || userData.password2.trim().length == 0) {
            reject("Error: user name cannot be empty or only white spaces!");
        }
        else if (userData.password != userData.password2) {
            reject("Passwords do not match");
        }
        else {
            bcrypt.hash(userData.password, 10).then((hash) => {
                userData.password = hash;
                let newUser = new User(userData);
                newUser.save((err) => {
                    if (err) {
                        if (err.code === 11000) {
                            reject("User Name already taken");
                        }
                        else {
                            reject("There was an error creating the user: " + err);
                        }
                    }
                    else {
                        resolve();
                    }
                })
            }).catch(() => {
                reject("There was an error encrypting the password")
            })

        }

    })
}

exports.checkUser = function (userData) {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: userData.userName })
            .exec()
            .then((foundUser) => {
                if (userName = "") {
                    reject("Unable to find user: " + userData.userName)
                }
                else {
                    bcrypt.compare(userData.password, foundUser.password).then((res) => {

                        if (res == true) {
                            foundUser.loginHistory.push({ dateTime: (new Date()).toString(), userAgent: userData.userAgent });
                            foundUser.update(
                                { userName: foundUser.userName },
                                { $set: { loginHistory: foundUser.loginHistory } },
                            ).exec().then(() => { resolve(foundUser) }).catch((err) => {
                                reject("There was an error verifying the user: " + err);
                            })
                        }
                        else {
                            reject('Incorrect Password for user: '+userData.userName);
                        }
                    })
                }
            })
            .catch(() => {
                reject("Unable to find user: " + userData.userName);
            })
    })
}