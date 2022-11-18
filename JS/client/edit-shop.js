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
    let shop = await getShop();
    let structure = await createCategoryStructure(shop.shopID);


    let shopname = document.getElementById('shopname');
    let description = document.getElementById('description');
    let contact = document.getElementById('contact');
    let workingHours = document.getElementById('hours');

    shopname.value = shop.shopName;
    description.value = shop.shopDescription;
    contact.value = shop.contactInformation;
    workingHours.value = shop.workingHours;



    const container = document.getElementById('container');
    // remove everything from container
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }



    for (let i = 0; i < structure.length; i++) {

        const category = document.createElement('div');
        const categoryInformation = document.createElement('div');
        const info = document.createElement('div');
        const categoryTitle = document.createElement('h3');
        const categoryName = document.createElement('p');
        categoryName.contentEditable = "true";
        const save = document.createElement('button');
        const remove = document.createElement('button');
        const serviceAdder = document.createElement('div');
        const serviceType = document.createElement('input');
        const servicePrice = document.createElement('input');
        const addServiceButton = document.createElement('button');
        const addIcon = document.createElement('i');





        categoryName.setAttribute('id', `category-name-${structure[i].categoryID}`);
        serviceType.setAttribute('id', `service-type-${structure[i].categoryID}`);
        servicePrice.setAttribute('id', `service-price-${structure[i].categoryID}`);




        remove.onclick = async () => {
            let res = await fetch(`http://localhost:3000/remove-category?categoryID=${structure[i].categoryID}&shopID=${shop.shopID}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            });

            let data = await res.json();
            location.reload();
        }

        save.onclick = async () => {
            let categoryName = document.getElementById(`category-name-${structure[i].categoryID}`).textContent;

            // 
            await fetch(`http://localhost:3000/change-category-name?categoryID=${structure[i].categoryID}&categoryName=${categoryName}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            });
            location.reload();
        }


        addServiceButton.onclick = async () => {
            let serviceID = getRandomString("SERVICE");
            let serviceType = document.getElementById(`service-type-${structure[i].categoryID}`).value;
            let servicePrice = document.getElementById(`service-price-${structure[i].categoryID}`).value;
            let shopID = shop.shopID;

            // 
            await fetch(`http://localhost:3000/add-service?serviceID=${serviceID}&serviceType=${serviceType}&price=${servicePrice}&categoryID=${structure[i].categoryID}&shopID=${shopID}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            });
            location.reload();
        }




        categoryTitle.textContent = "Chategory Name: ";
        categoryName.textContent = `${structure[i].categoryName}`;
        save.textContent = "Save Category Name";
        remove.textContent = "remove Category";
        serviceAdder.textContent = "Add a service";
        serviceType.placeholder = "service name";
        servicePrice.placeholder = "service price";
        addServiceButton.textContent = "add service ";
        category.classList.add('chategory');
        categoryInformation.classList.add('chategory-information');
        info.classList.add('info-box');
        categoryName.classList.add('chategory-current-name');
        save.classList.add('save-chategory-button');
        remove.classList.add('remove-chategory-button');
        serviceAdder.classList.add('service-adder-div');
        serviceType.classList.add('service-info');
        servicePrice.classList.add('service-info');
        addServiceButton.classList.add('add-chategory-button')
        addIcon.classList.add('fa-sharp');
        addIcon.classList.add('fa-solid');
        addIcon.classList.add(['fa-add']);


        info.appendChild(categoryTitle);
        info.appendChild(categoryName);
        categoryInformation.appendChild(info);
        categoryInformation.appendChild(save);
        categoryInformation.appendChild(remove);
        category.appendChild(categoryInformation);
        serviceAdder.appendChild(serviceType);
        serviceAdder.appendChild(servicePrice);
        addServiceButton.appendChild(addIcon);
        serviceAdder.appendChild(addServiceButton);
        category.appendChild(serviceAdder);

        let services = structure[i].services;
        for (let j = 0; j < services.length; j++) {

            let service = document.createElement('div');
            service.classList.add('service');

            let serviceInfo = document.createElement('div');
            serviceInfo.classList.add('service-information');

            let infoBox1 = document.createElement('div');
            let infoBox2 = document.createElement('div');
            infoBox1.classList.add('info-box');
            infoBox2.classList.add('info-box');


            let serviceTitle = document.createElement('h3');
            serviceTitle.textContent = "Service Name: ";

            let priceTitle = document.createElement('h3');
            priceTitle.textContent = "Service price: ";

            let serviceName = document.createElement('p');
            let servicePrice = document.createElement('p');
            let currencyText = document.createElement('p');

            let buttonHolder = document.createElement('div');
            let saveService = document.createElement('button');
            let removeService = document.createElement('button');

            saveService.textContent = "Save Changes";
            removeService.textContent = "Remove Service";

            saveService.classList.add('save-service-button');
            removeService.classList.add('remove-service-button');


            removeService.onclick = async () => {

                let serviceID = services[j].serviceID;
                await fetch(`http://localhost:3000/remove-service-by-id?serviceID=${serviceID}`, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                    },
                });
                location.reload();
            }



            saveService.onclick = async () => {

                let serviceID = services[j].serviceID;

                let serviceNameText = document.getElementById(`service-name-${services[j].serviceID}`).textContent;
                let servicePriceText = document.getElementById(`service-price-${services[j].serviceID}`).textContent;



                await fetch(`http://localhost:3000/update-service?serviceID=${serviceID}&serviceType=${serviceNameText}&price=${servicePriceText}`, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                    },
                });
                location.reload();
            }





            serviceName.textContent = services[j].serviceType;
            servicePrice.textContent = services[j].price;



            serviceName.contentEditable = "true";
            serviceName.setAttribute('id', `service-name-${services[j].serviceID}`);

            servicePrice.contentEditable = "true";
            servicePrice.setAttribute('id', `service-price-${services[j].serviceID}`);

            currencyText.textContent = '$';

            serviceName.classList.add('service-name');
            servicePrice.classList.add('service-price');
            currencyText.classList.add('currency-text');


            let reviewLink = document.createElement('a');
            reviewLink.textContent = "View Reviews";
            reviewLink.classList.add('review');
            reviewLink.href = (location.protocol + '//' + location.host + "/review-page.html?serviceID=") + services[j].serviceID;





            infoBox1.appendChild(serviceTitle);
            infoBox1.appendChild(serviceName);

            infoBox2.appendChild(priceTitle);
            infoBox2.appendChild(servicePrice);
            infoBox2.appendChild(currencyText);



            serviceInfo.appendChild(infoBox1);
            serviceInfo.appendChild(infoBox2);

            service.appendChild(serviceInfo);

            buttonHolder.appendChild(saveService);
            buttonHolder.appendChild(removeService);
            service.appendChild(buttonHolder);

            service.appendChild(reviewLink);


            category.appendChild(service);














        }





        container.appendChild(category);
    }




    // <div class="chategory">
    //     <div class="chategory-information">
    //         <div class="info-box">
    //             <h3>Chategory Name: </h3>
    //             <p class="chategory-current-name" contenteditable="true">chatergory name</p>
    //         </div>

    //         <button class="save-chategory-button">save chategory name</button>
    //         <button class="remove-chategory-button">remove chategory</button>
    //     </div>



    //     <div class="service-adder-div">
    //         <input type="text" class="service-info" placeholder="service name">
    //             <input type="text" class="service-info" placeholder="service price">
    //                 <button class="add-chategory-button">add service <i class="fa-sharp fa-solid fa-add"></i>
    //                 </button>
    //             </div>


    //             <div class="service">
    //                 <div class="service-information">
    //                     <div class="info-box">
    //                         <h3>Service Name: </h3>
    //                         <p class="service-name" contenteditable="true">service name </p>
    //                     </div>
    //                     <div class="info-box">
    //                         <h3>Price: </h3>

    //                         <p class="service-price" contenteditable="true">30</p>
    //                         <p class="currency-text">$</p>
    //                     </div>
    //                 </div>
    //                 <div>
    //                     <button class="save-service-button">save changes</button>
    //                     <button class="remove-service-button">remove service</button>
    //                 </div>
    //             </div>

    //     </div>


}



async function updateShop() {
    let shopID = getQueryParams()?.shopID;
    let shopname = document.getElementById('shopname').value;
    let description = document.getElementById('description').value;
    let contact = document.getElementById('contact').value;
    let workingHours = document.getElementById('hours').value;

    console.log(shopID, shopname, description, contact, workingHours);


    let response = await fetch(`http://localhost:3000/update-shop?shopID=${shopID}&shopName=${shopname}&shopDescription=${description}&contactInformation=${contact}&workingHours=${workingHours}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    console.log(shopID, shopname, description, contact, workingHours);
    let data = await response.json();
    location.reload();
}


async function addCategory() {
    // http://localhost:3000/add-category?categoryID=123&categoryName=cut-hair&shopID=123

    let value = document.getElementById('category-name').value;
    if (!value || value === "") return;

    let shopID = getQueryParams()?.shopID;
    let categoryID = getRandomString("CATEGORY");

    await fetch(`http://localhost:3000/add-category?categoryID=${categoryID}&categoryName=${value}&shopID=${shopID}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });
    location.reload();
}




loadPage();
