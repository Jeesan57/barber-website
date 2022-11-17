function getRandomString(key) {

    let strLen = 32;
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var result = ""
    var charactersLength = characters.length;

    for (var i = 0; i < strLen; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return (key + "_" + result);
}


function checkIfLoggedIn() {
    var storedID = JSON.parse(localStorage['userID']);
    if (!storedID)
        document.location.href = (location.protocol + '//' + location.host + "/index.html");
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



// 
async function addBooking(shopName, serviceType, requestedBy, requestedForShop,  requestTime) {
    let requestID = getRandomString('BOOKING');
    let timestamp = Date.now();


    await fetch(`http://localhost:3000/add-request?requestID=${requestID}&shopName=${shopName}&serviceType=${serviceType}&requestedBy=${requestedBy}&requestedForShop=${requestedForShop}&status=pending&requestTime=${requestTime}&timestamp=${timestamp}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });
}

async function getCategories(shopID) {

    // get shop information
    let response, data;
    response = await fetch(`http://localhost:3000/get-categories?shopID=${shopID}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    data = await response.json();
    return data.result;
}

async function getServices(categoryID) {
    // get shop information
    let response, data;
    response = await fetch(`http://localhost:3000/get-services?categoryID=${categoryID}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    data = await response.json();
    return data.result;
}

async function createCategoryStructure(shopID) {
    const structure = [];
    const categories = await getCategories(shopID);
    for (const category of categories) {
        const services = await getServices(category.categoryID);
        category.services = services;
        structure.push(category);
    }

    return structure;
}

async function loadPage() {
    checkIfLoggedIn();

    // get shopID
    let shopID = getQueryParams()?.shopID;
    if (!shopID) {
        document.location.href = (location.protocol + '//' + location.host + "/user-dashboard.html");
    }

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
        document.location.href = (location.protocol + '//' + location.host + "/user-dashboard.html");
        return;
    }
    let shop = data.shop;
    // populate shop information
    document.getElementById('shop-name').textContent = shop.shopName;
    document.getElementById('shop-description').textContent = shop.shopDescription;
    document.getElementById('shop-contact').textContent = shop.contactInformation;
    document.getElementById('shop-hour').textContent = shop.workingHours;


    const container = document.getElementById('container');
    // remove everything from container
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }

    // <div class="chategory">
    //     <div class="chategory-info">
    //         <h3 class="chategory-title">
    //             Chategory Name:
    //         </h3>
    //         <p class="chategory-name">cutting hair</p>
    //     </div>
    //     <div class="service">
    //         <div class="service-information">

    //             <h3>Service</h3>
    //             <p class="service-name">bati cut</p>
    //             <h3>Price</h3>
    //             <p class="service-price">30$</p>

    //             <div class="booking-box">
    //                 <h3>Book an appointment</h3>
    //                 <input type="text" class="booking-input" placeholder="hh:mm dd/mm/yy">
    //                     <button class="booking-button">Book</button>
    //             </div>

    //         </div>
    //     </div>
    // </div>

    let structure = await createCategoryStructure(shopID);
    console.log(structure)

    for (let i = 0; i < structure.length; i++) {
        let category = structure[i];

        let categoryDiv = document.createElement('div');
        categoryDiv.classList.add("chategory");

        let categoryInfoDiv = document.createElement('div');
        categoryInfoDiv.classList.add("chategory-info");

        let categoryTitle = document.createElement('h3');
        categoryTitle.classList.add("chategory-title");
        categoryTitle.textContent = "Category Name: ";

        let categoryName = document.createElement('div');
        categoryName.classList.add("chategory-name");
        categoryName.textContent = category.categoryName;


        categoryInfoDiv.appendChild(categoryTitle);
        categoryInfoDiv.appendChild(categoryName);
        categoryDiv.appendChild(categoryInfoDiv)


        let services = category.services;
        for (let j = 0; j < services.length; j++) {
            let serviceDiv = document.createElement('div');
            serviceDiv.classList.add("service");

            let serviceInformationDiv = document.createElement('div');
            serviceInformationDiv.classList.add("service-information");

            let serviceTitle = document.createElement('h3');
            serviceTitle.textContent = "Service";
            let serviceName = document.createElement('p');
            serviceName.textContent = services[j].serviceType;

            let servicePriceTitle = document.createElement('h3');
            servicePriceTitle.textContent = "price";
            let servicePrice = document.createElement('p');
            servicePrice.textContent = services[j].price + '$';



            let bookingBox = document.createElement('div');
            bookingBox.classList.add("booking-box");

            let bookingTitle = document.createElement('h3');
            bookingTitle.textContent = "Book an appointment";


            let bookingButton = document.createElement('button');
            bookingButton.classList.add('booking-button');
            bookingButton.textContent = "book service";

            let bookingInput = document.createElement('input');
            bookingInput.classList.add('booking-input');
            bookingInput.setAttribute('id', `${services[j].serviceID}`);
            bookingInput.placeholder = "hh:mm dd/mm/yy";



            bookingButton.onclick = async () => {
                let valueOfInput = document.getElementById(services[j].serviceID).value;
                let userID =  JSON.parse(localStorage['userID']);
                console.log(valueOfInput);
                console.log(services[j].serviceID);
                await addBooking(shop.shopName, services[j].serviceType, userID, shop.shopID, valueOfInput);
                location.reload();
            }

            serviceInformationDiv.appendChild(serviceTitle);
            serviceInformationDiv.appendChild(serviceName);
            serviceInformationDiv.appendChild(servicePriceTitle);
            serviceInformationDiv.appendChild(servicePrice);
            serviceDiv.appendChild(serviceInformationDiv);
            bookingBox.appendChild(bookingTitle);
            bookingBox.appendChild(bookingInput);
            bookingBox.appendChild(bookingButton);


            serviceDiv.appendChild(bookingBox);
            categoryDiv.appendChild(serviceDiv);
        }








        container.appendChild(categoryDiv);
    }





}

loadPage();

