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
        document.location.href = (location.protocol + '//' + location.host + "/owner-dashboard.html");
        return;
    }
    let shop = data.shop;
    return shop;
}

async function checkIfLoggedIn() {
    var storedID = JSON.parse(localStorage['userID']);
    if (!storedID)
        document.location.href = (location.protocol + '//' + location.host + "/index.html");

    let shop = await getShop();
    if (storedID !== shop.ownerID) {
        document.location.href = (location.protocol + '//' + location.host + "/owner-dashboard.html");
    }

    return shop;
}



async function loadPage() {

    checkIfLoggedIn();
    let shop = await getShop();
    console.log(shop);

    let shopname = document.getElementById('shopname');
    let description = document.getElementById('description');
    let contact = document.getElementById('contact');
    let workingHours = document.getElementById('hours');

    shopname.textContent = shop.shopName;
    description.textContent = shop.shopDescription;
    contact.textContent = shop.contactInformation;
    workingHours.textContent = shop.workingHours;
}

async function updateShop() {
    let shopID = getQueryParams()?.shopID;
    let shopname = document.getElementById('shopname').textContent;
    let description = document.getElementById('description').textContent;
    let contact = document.getElementById('contact').textContent;
    let workingHours = document.getElementById('hours').textContent;

    let response = await fetch(`http://localhost:3000/update-shop?shopID=${shopID}&shopName=${shopname}&shopDescription=${description}&contactInformation=${contact}&workingHours=${workingHours}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });
    let data = await response.json();
    location.reload();
}




loadPage();
