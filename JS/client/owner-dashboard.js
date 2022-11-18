function checkIfLoggedIn() {
    var storedID = JSON.parse(localStorage['userID']);
    if (!storedID)
        document.location.href = (location.protocol + '//' + location.host + "/index.html");
}

function logout() {
    localStorage['userID'] = JSON.stringify(null);
    localStorage['isOwner'] = JSON.stringify(null);
    document.location.href = (location.protocol + '//' + location.host + "/index.html");
}

async function getShopStatistics() {

    let result = {};

    let ownerID = JSON.parse(localStorage['userID']);
    let response, data;
    response = await fetch(`http://localhost:3000/get-shop-statistics?ownerID=${ownerID}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    data = await response.json();
    result = { ...result, ...data };

    let shopID = data.shopID;

    // accepted count
    response = await fetch(`http://localhost:3000/get-request-count?status=accepted&shopID=${shopID}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    data = await response.json();
    let acceptedCount = data.count;
    result = { ...result, acceptedCount };



    // accepted count
    response = await fetch(`http://localhost:3000/get-request-count?status=pending&shopID=${shopID}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    data = await response.json();
    let pendingCount = data.count;
    result = { ...result, acceptedCount, pendingCount };


    // http://localhost:3000/get-request-count?status=accepte&shopID=1232qe

    return result;
}

async function getUser() {
    // get shop information
    let response, data;
    let userID = JSON.parse(localStorage['userID']);
    response = await fetch(`http://localhost:3000/get-user?userID=${userID}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    data = await response.json();
    return data.user;
}


async function loadPage() {
    checkIfLoggedIn();
    username = document.getElementById('username');
    let shopname = document.getElementById('shopname');
    let approvalButton = document.getElementById('approve-button');
    let appointmentButton = document.getElementById('appointment-button');
    let changeButton = document.getElementById('change-info');
    let category = document.getElementById('category');
    let service = document.getElementById('service');
    let pending = document.getElementById('pending');
    let accepted = document.getElementById('accepted');

    let user = await getUser();
    let statistics = await getShopStatistics();

    username.textContent = user.userName;
    shopname.textContent = "Shop Name : " + statistics.shopName;



    category.textContent = `you provide ${statistics.categoryCount} category`;
    service.textContent = `you provide ${statistics.serviceCount}  services`;
    pending.textContent = `${statistics.pendingCount} requests need approval`;
    accepted.textContent = `${statistics.acceptedCount} appointments`;


    approvalButton.onclick = () => {
        document.location.href = (location.protocol + '//' + location.host + "/booking-approval.html?shopID=" + statistics.shopID);
    }

    appointmentButton.onclick = () => {
        document.location.href = (location.protocol + '//' + location.host + "/services-schedule.html?shopID=" + statistics.shopID);
    }


    changeButton.onclick = () => {
        document.location.href = (location.protocol + '//' + location.host + "/edit-shop.html?shopID=" + statistics.shopID);
    }




}

loadPage();