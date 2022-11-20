
async function getShop() {
    let shopID = getQueryParams()?.shopID;
    // get shop information
    let response, data;
    response = await fetch(`http://localhost:3000/get-shop?shopID=${shopID}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    data = await response.json();
    if (data.error) {
        const url = window.location.pathname
        const baseURL = url.slice(0, url.lastIndexOf('/'));
        document.location.href = (baseURL + "/owner-dashboard.html");
        return;
    }
    let shop = data.shop;
    return shop;
}


async function checkIfLoggedIn() {
    var storedID = JSON.parse(localStorage['userID']);
    if (!storedID) {

        const url = window.location.pathname
        const baseURL = url.slice(0, url.lastIndexOf('/'));
        document.location.href = (baseURL +  "/index.html");
    }

    let shop = await getShop();
    if (storedID !== shop.ownerID) {
        const url = window.location.pathname
        const baseURL = url.slice(0, url.lastIndexOf('/'));
        document.location.href = (baseURL +  "/owner-dashboard.html");
    }

}

function getQueryParams() {
    const url = window.location.href;
    const paramArr = url.slice(url.indexOf('?') + 1).split('&');
    const params = {};
    paramArr.map(param => {
        const [key, val] = param.split('=');
        params[key] = decodeURIComponent(val);
    })
    return params;
}



async function getAppointments() {

    let shopID = getQueryParams()?.shopID;
    // get shop information
    let response, data;
    response = await fetch(`http://localhost:3000/get-pending-requests?shopID=${shopID}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    data = await response.json();
    let appointments = data.requests;
    if (!appointments) appointments = [];
    return appointments;
}



async function loadPage() {
    checkIfLoggedIn();

    let shopID = getQueryParams()?.shopID;
    const appointments = await getAppointments(shopID);

    const container = document.getElementById('container');
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }


    let informationArray = [];
    for (let i = 0; i < appointments.length; i++) {

        let informationString = `Your have an appointment booked for "Service : ${appointments[i].serviceType}" Appointment Time: "${appointments[i].requestTime}"  in "Shop Name: ${appointments[i].shopName}"`;



        


        let approvalBox = document.createElement('div');
        approvalBox.classList.add('approval-box');

        let requestText = document.createElement('p');
        requestText.classList.add('request-text');

        let buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');



        let accept = document.createElement('button');
        accept.textContent = "accept"
        accept.classList.add('accept');

        accept.onclick = async () => {
            let res = await fetch(`http://localhost:3000/update-request-status?requestID=${appointments[i].requestID}&status=accepted`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            });

            let data = await res.json();
            location.reload();

        }


        let deny = document.createElement('button');
        deny.textContent = "deny"
        deny.classList.add('deny');

        deny.onclick = async () => {
            let res = await fetch(`http://localhost:3000/update-request-status?requestID=${appointments[i].requestID}&status=denied`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            });

            let data = await res.json();
            location.reload();

        }


        requestText.textContent = informationString
        approvalBox.appendChild(requestText);
        buttonContainer.appendChild(accept);
        buttonContainer.appendChild(deny);
        approvalBox.appendChild(buttonContainer);

        container.appendChild(approvalBox);
    }


}

loadPage();