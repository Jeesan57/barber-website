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


async function getAllShops() {
    let shops = [];
    let response = await fetch(`http://localhost:3000/get-all-shops`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    let data = await response.json();
    if (data && !data.error) {
        shops = data.shops;
    }
    return shops;
}

// <div class="shop">
//     <p class="prompt">
//         Shop name: <span class="info">Gent's Saloon</span>
//     </p>
//     <a href="./shops.html" class="view">
//         view shop
//     </a>
// </div>
async function populatePageWithShops(shops) {


    const container = document.getElementById('container');
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }


    for (let i = 0; i < shops.length; i++) {

        if (!shops[i].shopName) continue;
        // create shop div
        const shop = document.createElement('div');
        shop.classList.add('shop');

        const prompt = document.createElement('p');
        prompt.classList.add('prompt');
        prompt.textContent = "Shop name: ";

        const info = document.createElement('span');
        info.classList.add('info');
        info.textContent = shops[i].shopName;


        const view = document.createElement('a');
        view.classList.add('view');
        view.textContent = "View Shop";
        view.href = `/shop.html?shopID=${shops[i].shopID}`;

        prompt.appendChild(info);
        shop.appendChild(prompt);
        shop.appendChild(view);
        container.appendChild(shop);
    }
}


async function loadPage() {
    checkIfLoggedIn();
    const shops = await getAllShops();
    let user = await getUser();
    username = document.getElementById('username');
    username.textContent = user.userName;

    populatePageWithShops(shops);
}

async function filterShops() {
    const searchInput = document.getElementById('search-input');
    let search = searchInput.value;


    if (!search || search === "") {
        loadPage();
        return;
    }

    const shops = await getAllShops();
    let filtered = [];

    for (let i = 0; i < shops.length; i++) {

        if (!shops[i].shopName) continue;

        if (shops[i].shopName.includes(search)) {
            filtered.push(shops[i]);
        }
    }

    populatePageWithShops(filtered);


}


loadPage();
