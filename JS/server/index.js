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
            if (result && result.length !== 0) {
                queriedUser = result[0];
            }
            if (queriedUser !== null) {
                connection.end();
                res.json({ error: true, message: 'user already exist with the same username' });
                return;
            }
            connection.query(`INSERT INTO users (userID, userName, pass, isOwner) values ('${userID}', '${userName}', '${password}', '${isOwner}')`,
                function (err, result, fields) {

                    connection.query(`INSERT INTO shops (ownerID, shopID) values ('${userID}', '${userID}')`,
                        function (err, result, fields) {
                            connection.end();
                            res.json({ error: false, result: { userID, userName, password, isOwner } });
                            return;
                        });
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
            queryResult = result;
            if (result && result.length !== 0) {
                queriedUser = result[0];
            }

            if (queriedUser !== null) {
                if (queriedUser.pass === password && queriedUser.userName === userName) {
                    connection.end();
                    res.json({ error: false, user: queriedUser });
                    return;
                }
                else {
                    connection.end();
                    res.json({ error: true, message: "password doesn't match" });
                    return;
                }
            }
            else {
                connection.end();
                res.json({ error: true, message: 'user not found' });
                return;
            }
        });
    });
})




// http://localhost:3000/get-shop?shopID=Jeeshan3
app.get('/get-shop', async (req, res) => {

    let shopID = req.query.shopID;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    let queryShop = null;
    connection.connect(function (err) {
        connection.query(`SELECT * FROM shops WHERE shopID='${shopID}'`, function (err, result, fields) {
            queryResult = result;
            if (result && result.length !== 0) {
                queryShop = result[0];
            }

            if (queryShop !== null) {
                connection.end();
                res.json({ error: false, shop: queryShop });
                return;
            }
            else {
                connection.end();
                res.json({ error: true, message: 'shop not found' });
                return;
            }
        });
    });
})



// http://localhost:3000/get-all-shops
app.get('/get-all-shops', async (req, res) => {

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    let queryShop = null;
    connection.connect(function (err) {
        connection.query(`SELECT * FROM shops `, function (err, result, fields) {
            queryResult = result;
            if (result && result.length !== 0) {
                queryShop = result;
            }

            if (queryShop !== null) {

                connection.end();
                res.json({ error: false, shops: queryShop });
                return;
            }
            else {
                connection.end();
                res.json({ error: true, message: 'no shop found' });
                return;
            }
        });
    });
})



// http://localhost:3000/get-user?userID=Jeeshan3
app.get('/get-user', async (req, res) => {

    let userID = req.query.userID;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    let queryUser = null;
    connection.connect(function (err) {
        connection.query(`SELECT * FROM users WHERE userID='${userID}'`, function (err, result, fields) {
            if (result && result.length !== 0) {
                queryUser = result[0];
            }

            if (queryUser !== null) {
                connection.end();
                res.json({ error: false, user: queryUser });
                return;
            }
            else {
                connection.end();
                res.json({ error: true, message: 'user not found' });
                return;
            }
        });
    });
})


// http://localhost:3000/get-request-statuses?userID=Jeeshan
app.get('/get-request-statuses', async (req, res) => {

    let userID = req.query.userID;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    let queriedRequests = null;
    connection.connect(function (err) {
        connection.query(`SELECT * FROM request WHERE status='accepted' OR status='denied' AND requestedBy='${userID}'`, function (err, result, fields) {
            if (result && result.length !== 0) {
                queriedRequests = result;
            }

            if (queriedRequests !== null) {
                connection.end();
                res.json({ error: false, requests: queriedRequests });
                return;
            }
            else {
                connection.end();
                res.json({ error: true, message: 'no requests found', requests: queriedRequests });
                return;
            }
        });
    });
})

// http://localhost:3000/get-pending-requests?shopID=Jeeshan
app.get('/get-pending-requests', async (req, res) => {

    let shopID = req.query.shopID;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    let queriedRequests = null;
    connection.connect(function (err) {
        connection.query(`SELECT * FROM request WHERE status='pending' AND requestedForShop='${shopID}'`, function (err, result, fields) {
            if (result && result.length !== 0) {
                queriedRequests = result;
            }

            if (queriedRequests !== null) {
                connection.end();
                res.json({ error: false, requests: queriedRequests });
                return;
            }
            else {
                connection.end();
                res.json({ error: true, requests: [], message: 'no requests found' });
                return;
            }
        });
    });
})


// http://localhost:3000/get-accepted-requests?shopID=Jeeshan
app.get('/get-accepted-requests', async (req, res) => {

    let shopID = req.query.shopID;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    let queriedRequests = null;
    connection.connect(function (err) {
        connection.query(`SELECT * FROM request WHERE status='accepted' AND requestedForShop='${shopID}'`, function (err, result, fields) {
            if (result && result.length !== 0) {
                queriedRequests = result;
            }

            if (queriedRequests !== null) {
                connection.end();
                res.json({ error: false, requests: queriedRequests });
                return;
            }
            else {
                connection.end();
                res.json({ error: true, requests: [], message: 'no requests found' });
                return;
            }
        });
    });
})


// http://localhost:3000/get-requests?userID=Jeeshan
app.get('/get-requests', async (req, res) => {

    let userID = req.query.userID;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    let queriedRequests = null;
    connection.connect(function (err) {
        connection.query(`SELECT * FROM request WHERE requestedBy='${userID}'`, function (err, result, fields) {
            if (result && result.length !== 0) {
                queriedRequests = result;
            }

            if (queriedRequests !== null) {
                connection.end();
                res.json({ error: false, requests: queriedRequests });
                return;
            }
            else {
                connection.end();
                res.json({ error: true, message: 'no requests found' });
                return;
            }
        });
    });
})




// http://localhost:3000/remove-service-by-id?serviceID=Jeeshan
app.get('/remove-service-by-id', async (req, res) => {

    let serviceID = req.query.serviceID;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    let queriedRequests = null;
    connection.connect(function (err) {
        connection.query(`DELETE FROM service WHERE serviceID='${serviceID}'`, function (err, result, fields) {
            if (result) {
                queriedRequests = result;
            }

            if (queriedRequests !== null && queriedRequests.affectedRows !== 0) {
                connection.end();
                res.json({ error: false });
                return;
            }
            else {
                connection.end();
                res.json({ error: true });
                return;
            }
        });
    });
})


// http://localhost:3000/remove-service-by-categoryID?categoryID=123
app.get('/remove-service-by-categoryID', async (req, res) => {

    let categoryID = req.query.categoryID;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    let queriedRequests = null;
    connection.connect(function (err) {
        connection.query(`DELETE FROM service WHERE categoryID='${categoryID}'`, function (err, result, fields) {
            if (result) {
                queriedRequests = result;
            }

            if (queriedRequests !== null && queriedRequests.affectedRows !== 0) {
                connection.end();
                res.json({ error: false });
                return;
            }
            else {
                connection.end();
                res.json({ error: true });
                return;
            }
        });
    });
})


// http://localhost:3000/remove-category?categoryID=123&shopID=123
app.get('/remove-category', async (req, res) => {

    let categoryID = req.query.categoryID;
    let shopID = req.query.shopID;


    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    let queriedRequests = null;
    let error = false;
    connection.connect(function (err) {
        connection.query(`DELETE FROM service WHERE categoryID='${categoryID}'`, function (err, result, fields) {
        });

        connection.query(`DELETE FROM category WHERE shopID='${shopID}' AND categoryID='${categoryID}'`, function (err, result, fields) {
        });
        connection.end();
        res.json({ error: false });


    });
})


// http://localhost:3000/add-category?categoryID=123&categoryName=cut-hair&shopID=123
app.get('/add-category', async (req, res) => {

    let categoryID = req.query.categoryID;
    let categoryName = req.query.categoryName;
    let shopID = req.query.shopID;



    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    connection.connect(function (err) {
        connection.query(`INSERT INTO category (categoryID, categoryName, shopID) values ('${categoryID}', '${categoryName}', '${shopID}')`,
            function (err, result, fields) {
            });

        connection.end();
        res.json({ error: false });


    });
})


// 


// http://localhost:3000/update-password?userID=111&password=cut-hair
app.get('/update-password', async (req, res) => {

    let userID = req.query.userID;
    let password = req.query.password;



    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    connection.connect(function (err) {
        connection.query(`UPDATE users SET pass='${password}' WHERE userID='${userID}'`,
            function (err, result, fields) {
            });

        connection.end();
        res.json({ error: false });


    });
})


// http://localhost:3000/update-request-status?requestID=1&status=pending
app.get('/update-request-status', async (req, res) => {

    let requestID = req.query.requestID;
    let status = req.query.status;



    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    connection.connect(function (err) {
        connection.query(`UPDATE request SET status='${status}' WHERE requestID='${requestID}'`,
            function (err, result, fields) {
            });

        connection.end();
        res.json({ error: false });


    });
})

// http://localhost:3000/change-category-name?categoryID=1&categoryName=new-cut-hair
app.get('/change-category-name', async (req, res) => {

    let categoryID = req.query.categoryID;
    let categoryName = req.query.categoryName;



    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    connection.connect(function (err) {
        connection.query(`UPDATE category SET categoryName='${categoryName}' WHERE categoryID='${categoryID}'`,
            function (err, result, fields) {
            });

        connection.end();
        res.json({ error: false });


    });
})


// http://localhost:3000/add-service?serviceID=11231s1&serviceType=new-cut-hair-bati-cut&price=100&categoryID=1&shopID=12
app.get('/add-service', async (req, res) => {

    let serviceID = req.query.serviceID;
    let serviceType = req.query.serviceType;
    let price = req.query.price;
    let categoryID = req.query.categoryID;
    let shopID = req.query.shopID;




    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    connection.connect(function (err) {
        connection.query(`INSERT INTO service (serviceID, serviceType, price, categoryID, shopID) values ('${serviceID}', '${serviceType}', '${price}', '${categoryID}', '${shopID}')`,
            function (err, result, fields) {
            });

        connection.end();

        res.json({ error: false });


    });
})


// http://localhost:3000/update-service?serviceID=11231s1&serviceType=updated&price=1200
app.get('/update-service', async (req, res) => {

    let serviceID = req.query.serviceID;
    let serviceType = req.query.serviceType;
    let price = req.query.price;



    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    connection.connect(function (err) {
        connection.query(`UPDATE service SET serviceType='${serviceType}', price='${price}' WHERE serviceID='${serviceID}'`,
            function (err, result, fields) {
            });

        connection.end();
        res.json({ error: false });


    });
})


// 

// http://localhost:3000/get-request-count?status=accepte&shopID=1232qe
app.get('/get-request-count', async (req, res) => {

    let status = req.query.status;
    let shopID = req.query.shopID;



    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    connection.connect(function (err) {
        connection.query(`SELECT COUNT(requestID) FROM request WHERE status="${status}" AND requestedForShop="${shopID}"`,
            function (err, result, fields) {
                let count = 0;
                count = result[0]["COUNT(requestID)"];
                connection.end();
                res.json({ error: false, count });
                return;
            });

    });
})


// http://localhost:3000/get-shop-statistics?ownerID=12
app.get('/get-shop-statistics', async (req, res) => {

    let ownerID = req.query.ownerID;
    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    connection.connect(function (err) {


        let shopName = "";
        let categoryCount = 0;
        let serviceCount = 0;

        // get shop name
        connection.query(`SELECT shopName, shopID FROM shops WHERE ownerID="${ownerID}"`,
            function (err, result, fields) {
                if (!result || result.length === 0) {
                    connection.end();
                    res.json({ error: false, shopName: "", categoryCount: 0, serviceCount: 0 });
                    return;
                }
                shopName = result[0].shopName;
                let shopID = result[0].shopID;
                // get category count
                connection.query(`SELECT COUNT(categoryID) FROM category WHERE shopID="${shopID}"`,
                    function (err, result, fields) {
                        categoryCount = result[0]["COUNT(categoryID)"];

                        // get service count
                        connection.query(`SELECT COUNT(serviceID) FROM service WHERE shopID="${shopID}"`,
                            function (err, result, fields) {
                                serviceCount = result[0]["COUNT(serviceID)"];
                                connection.end();
                                res.json({ error: false, shopName, shopID, categoryCount, serviceCount });
                                return;
                            });
                    });
            });



    });
})


// http://localhost:3000/get-categories?shopID=12213
app.get('/get-categories', async (req, res) => {

    let shopID = req.query.shopID;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    connection.connect(function (err) {
        connection.query(`SELECT * FROM category WHERE shopID='${shopID}'`,
            function (err, result, fields) {
                connection.end();
                res.json({ error: false, result: result });
            });
    });
})





// http://localhost:3000/get-services?categoryID=1
app.get('/get-services', async (req, res) => {

    let categoryID = req.query.categoryID;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    connection.connect(function (err) {
        // connection.query(`SELECT * FROM category LEFT JOIN service ON category.categoryID=service.categoryID WHERE category.categoryID='${categoryID}'`,
        connection.query(`SELECT * FROM service WHERE categoryID='${categoryID}'`,
            function (err, result, fields) {
                connection.end();
                res.json({ error: false, result: result });
            });
    });
})


// http://localhost:3000/get-service?serviceID=1
app.get('/get-service', async (req, res) => {

    let serviceID = req.query.serviceID;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    connection.connect(function (err) {
        // connection.query(`SELECT * FROM category LEFT JOIN service ON category.categoryID=service.categoryID WHERE category.categoryID='${categoryID}'`,
        connection.query(`SELECT * FROM service WHERE serviceID='${serviceID}'`,
            function (err, result, fields) {
                connection.end();
                res.json({ error: false, result: result[0] });
            });
    });
})


//INSERT INTO `request` (`requestID`, `requestedBy`, `requestedForShop`, `status`, `requestTime`, `timestamp`) VALUES ('`12123', 'asd', 'sadas', '123123', '12312', '123123');

// http://localhost:3000/add-request?requestID=123ftycf&shopName=123ftycf&serviceType=123ftycf&requestedBy=cut-hair&requestedForShop=123&status=123&requestTime=123&timestamp=123
app.get('/add-request', async (req, res) => {

    let requestID = req.query.requestID;
    let shopName = req.query.shopName;
    let serviceType = req.query.serviceType;

    let requestedBy = req.query.requestedBy;
    let requestedForShop = req.query.requestedForShop;
    let status = req.query.status;
    let requestTime = req.query.requestTime;
    let timestamp = req.query.timestamp;


    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    connection.connect(function (err) {
        connection.query(`INSERT INTO request (requestID, shopName, serviceType, requestedBy, requestedForShop, status, requestTime, timestamp) 
        VALUES ('${requestID}', '${shopName}','${serviceType}', '${requestedBy}', '${requestedForShop}', '${status}', '${requestTime}', '${timestamp}');`,
            function (err, result, fields) {
            });

        connection.end();
        res.json({ error: false });


    });
})


/*
ownerID
shopID
shopName
shopDescription
contactInformation
workingHours
*/


// http://localhost:3000/update-shop?shopID=12&shopName=ffjfh&shopDescription=fkfhglld&contactInformation=ffaljflatohglhd&workingHours=23:347
app.get('/update-shop', async (req, res) => {

    let shopID = req.query.shopID;
    let shopName = req.query.shopName;
    let shopDescription = req.query.shopDescription;
    let contactInformation = req.query.contactInformation;
    let workingHours = req.query.workingHours;





    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });

    connection.connect(function (err) {
        connection.query(`UPDATE shops SET
         shopName='${shopName}', shopDescription='${shopDescription}', contactInformation='${contactInformation}', workingHours='${workingHours}'  WHERE shopID='${shopID}'`,
            function (err, result, fields) {
            });

        connection.end();
        res.json({ error: false });


    });
})



// http://localhost:3000/get-request?requestedBy=cut-hair
app.get('/get-request', async (req, res) => {

    let requestedBy = req.query.requestedBy;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });


    connection.connect(function (err) {
        connection.query(`SELECT * FROM request  WHERE request.requestedBy='${requestedBy}'`,
            function (err, result, fields) {
                connection.end();
                res.json({ error: false, result: result });
            });
    });
})


// get all reviews for serviceID
// http://localhost:3000/get-reviews?serviceID=cut-hair
app.get('/get-reviews', async (req, res) => {

    let serviceID = req.query.serviceID;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });


    connection.connect(function (err) {
        connection.query(`SELECT * FROM reviews  WHERE serviceID='${serviceID}'`,
            function (err, result, fields) {
                connection.end();
                res.json({ error: false, result: result });
            });
    });
})


// get review for reviewID
// http://localhost:3000/get-review?reviewID=cut-hair
app.get('/get-review', async (req, res) => {

    let reviewID = req.query.reviewID;

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });


    connection.connect(function (err) {
        connection.query(`SELECT * FROM reviews  WHERE reviewID='${reviewID}'`,
            function (err, result, fields) {
                connection.end();
                res.json({ error: false, result: result[0] });
            });
    });
})

// upsert review : reviewID, userID, serviceID, review, rating
// http://localhost:3000/upsert-review?reviewID=123&userID=cut-hair&serviceID=cut-hair&review=cut-hair&rating=5
app.get('/upsert-review', async (req, res) => {

    let reviewID = req.query.reviewID;
    let userID = req.query.userID;
    let serviceID = req.query.serviceID;
    let reviewText = req.query.review;
    let rating = req.query.rating;


    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "barbar_shop"
    });


    connection.connect(function (err) {
        connection.query(`SELECT * FROM reviews  WHERE reviewID='${reviewID}'`,
            function (err, result, fields) {

                let review = result[0];

                if (review) // update 
                {

                    connection.query(`UPDATE reviews SET review='${reviewText}', rating='${rating}' WHERE reviewID='${reviewID}'`,
                        function (err, result, fields) {
                            connection.end();
                            res.json({ error: false, result: result[0] });
                        });
                }
                else // insert
                {
                    connection.query(`INSERT INTO reviews (reviewID, userID, serviceID, review, rating) VALUES ('${reviewID}', '${userID}', '${serviceID}', '${reviewText}', '${rating}');`,
                        function (err, result, fields) {
                            connection.end();
                            res.json({ error: false, result: result[0] });
                        });
                }
            });
    });
})





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


