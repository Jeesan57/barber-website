function checkIfLoggedIn() {
    var storedID = JSON.parse(localStorage['userID']);
    if (!storedID) {

        const url = window.location.pathname;
        const baseURL = url.slice(0, url.lastIndexOf('/'));
        document.location.href = (baseURL + "/index.html");
    }
}



async function getRequests() {

    let userID = JSON.parse(localStorage['userID']);
    // get shop information
    let response, data;
    response = await fetch(`http://localhost:3000/get-requests?userID=${userID}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    data = await response.json();
    let requests = data.requests;
    if (!requests) requests = [];
    return requests;
}



async function loadPage() {
    checkIfLoggedIn();
    const requests = await getRequests();

    let informationArray = [];
    for (let i = 0; i < requests.length; i++) {
        let informationString = `your request for booking "${requests[i].serviceType}" @${requests[i].requestTime} in "${requests[i].shopName}" is `;
        if (requests[i].status === "done")
            informationString += "marked as ";
        informationString += requests[i].status;
        let requestTimeStampDate = new Date(requests[i].timestamp);
        let timestampString = requestTimeStampDate.toString("HH:mm d-MMM-yyyy");
        informationArray.push({
            informationString,
            timestampString
        });
    }


    const container = document.getElementById('container');
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }

    // <div class="approval-box">
    //     <p class="request-text"> Your request for the booking of "service name" @timestamp in "shopname" has
    //         been denied by the owner of the shop. </p>
    //     <p class="timestamp">1/11/2021 5:50pm</p>
    // </div>


    for (let i = 0; i < informationArray.length; i++) {
        let approvalBox = document.createElement('div');
        approvalBox.classList.add('approval-box');

        let requestText = document.createElement('p');
        requestText.classList.add('request-text');
        requestText.textContent = informationArray[i].informationString;

        let timestamp = document.createElement('p');
        timestamp.classList.add('timestamp');
        timestamp.textContent = informationArray[i].timestampString;

        approvalBox.appendChild(requestText);
        approvalBox.appendChild(timestamp);
        container.appendChild(approvalBox);

    }




}

loadPage();