function checkIfLoggedIn() {
    var storedID = JSON.parse(localStorage['userID']);
    if (!storedID) {
        const url = window.location.pathname;
        const baseURL = url.slice(0, url.lastIndexOf('/'));
        document.location.href = (baseURL + "/index.html");
    }
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

    let user = await getUser();
    let username = document.getElementById('username');
    if (user) username.textContent = user.userName;
    let link = document.getElementById('dashboard-link');
    if (user.isOwner == 1) {

        const url = window.location.pathname;
        const baseURL = url.slice(0, url.lastIndexOf('/'));
        document.location.href = (baseURL + "/owner-dashboard.html");
    }
    else {

        const url = window.location.pathname;
        const baseURL = url.slice(0, url.lastIndexOf('/'));
        document.location.href = (baseURL + "/user-dashboard.html");
    }



}

async function changePassword() {

    let value1 = document.getElementById('input-1').value;
    let value2 = document.getElementById('input-2').value;
    if (value1 !== value2) return;

    let userID = JSON.parse(localStorage['userID']);
    let password = value1;


    await fetch(`http://localhost:3000/update-password?userID=${userID}&password=${password}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    location.reload();



}
loadPage();