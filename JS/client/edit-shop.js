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

    shopname.textContent = shop.shopName;
    description.textContent = shop.shopDescription;
    contact.textContent = shop.contactInformation;
    workingHours.textContent = shop.workingHours;



    const container = document.getElementById('container');
    // remove everything from container
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }


    console.log(structure);

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



        remove.onclick = async () => {
            let res = await fetch(`http://localhost:3000/remove-category?categoryID=${structure[i].categoryID}&shopID=${shop.shopID}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            });

            let data = await res.json();
            console.log(data);
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





        categoryTitle.textContent = "Chategory Name: ";
        categoryName.textContent = `${structure[i].categoryName}`;
        save.textContent = "Save Category Name";
        remove.textContent = "remove Category";
        serviceAdder.textContent = "remove Category";
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
