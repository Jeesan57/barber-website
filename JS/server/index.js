const express = require('express');
let mysql = require('mysql');
var cors = require('cors');
const app = express();
app.use(cors());

const port = process.env.PORT || 3000;




app.get('/', async (req, res) => {

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: ""
    });

    connection.connect(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.send('database connected');
        }
    });
})


// http://localhost:3000/create-user?userID=4561&userName=Jeeshan3&password=1234&isOwner=1
app.get('/create-user', async (req, res) => {

    let userID = req.query.userID;
    let userName = req.query.userName;
    let password = req.query.password;
    let isOwner = req.query.isOwner;
    isOwner = parseInt(isOwner);

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    connection.connect(function (err) {

        let queriedUser = null;
        connection.query(`SELECT * FROM users WHERE userName='${userName}'`, function (err, result, fields) {
            console.log(result);
            if (result && result.length !== 0) {
                queriedUser = result[0];
            }
            if (queriedUser !== null) {
                res.json({ error: true });
                return;
            }
            connection.query(`INSERT INTO users (userID, userName, pass, isOwner) values ('${userID}', '${userName}', '${password}', '${isOwner}')`,
                function (err, result, fields) {
                    console.log(result);
                    if (!result) {
                        res.json({ error: true });
                        return;
                    }
                    res.json({ error: false, result: { userID, userName, password, isOwner } });
                    return;
                });

        });

    });



})



// http://localhost:3000/login?userName=Jeeshan3&password=1234
app.get('/login', async (req, res) => {

    let userName = req.query.userName;
    let password = req.query.password;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    let queriedUser = null;
    let queryResult = null;
    connection.connect(function (err) {
        connection.query(`SELECT * FROM users WHERE userName='${userName}'`, function (err, result, fields) {
            console.log(result);
            queryResult = result;
            if (result && result.length !== 0) {
                queriedUser = result[0];
            }

            if (queriedUser !== null) {
                if (queriedUser.pass === password && queriedUser.userName === userName) {
                    res.json({ error: false, user: queriedUser });
                    return;
                }
                else {
                    res.json({ error: true, message: "password doesn't match" });
                    return;
                }
            }
            else {
                res.json({ error: true, message: 'user not found' });
                return;
            }
        });
    });
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})