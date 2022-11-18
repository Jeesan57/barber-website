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


async function getUser(userID) {
    // get shop information
    let response, data;
    response = await fetch(`http://localhost:3000/get-user?userID=${userID}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    data = await response.json();
    return data.user;
}
async function getService(serviceID) {
    // get shop information
    let response, data;
    let userID = JSON.parse(localStorage['userID']);


    response = await fetch(`http://localhost:3000/get-service?serviceID=${serviceID}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    data = await response.json();
    return data.result;
}


async function getShop(shopID) {
    // get shop information
    let response, data;
    response = await fetch(`http://localhost:3000/get-shop?shopID=${shopID}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    data = await response.json();
    let shop = data.shop;
    return shop;
}




async function getReviews(serviceID) {
    // get shop information
    let response, data;
    response = await fetch(`http://localhost:3000/get-reviews?serviceID=${serviceID}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    data = await response.json();
    return data.result;
}

async function createReviewStructure(serviceID) {
    const structure = [];
    let sum = 0.0;
    const reviews = await getReviews(serviceID);
    for (const review of reviews) {
        const user = await getUser(review.userID);
        review.userName = user?.userName;
        sum += parseFloat(review.rating);
        structure.push(review);
    }
    let average = sum / reviews.length;
    let result = {
        reviews: structure,
        averageRating: average,
    }
    return result;
}


async function loadPage() {
    checkIfLoggedIn();



    let isOwner = JSON.parse(localStorage['isOwner']);
    let serviceID = getQueryParams()?.serviceID;
    let service = await getService(serviceID);
    if (!service) {
        if (isOwner == 1)
            document.location.href = (location.protocol + '//' + location.host + "/owner-dashboard.html");
        else
            document.location.href = (location.protocol + '//' + location.host + "/user-dashboard.html");
    }

    let link = document.getElementById('dashboard');
    if (isOwner == 1)
        link.href = "./owner-dashboard.html";
    else
        link.href = "/user-dashboard.html";



    let serviceName = document.getElementById('service-name');
    serviceName.textContent = "Service Name : " + service.serviceType;

    let shopID = service.shopID;

    let shop = await getShop(shopID);

    let shopName = document.getElementById('shop-name');
    shopName.textContent = "Shop Name : " + shop.shopName;

    let result = await createReviewStructure(serviceID);
    let averageRating = document.getElementById('average-rating');
    averageRating.textContent = `Average Rating: ${result.averageRating}/5.0`;

    let container = document.getElementById('container');
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }

    for (let i = 0; i < result.reviews.length; i++) {
        let reviewBox = document.createElement('div');
        reviewBox.classList.add('review-box');
        let profileInfo = document.createElement('div');
        profileInfo.classList.add('profile-info');
        let profile = document.createElement('div');
        profile.classList.add('profile');
        let profileImage = document.createElement('img');
        profileImage.src = './assets/profile-image.jpg';
        let userName = document.createElement('p');
        userName.textContent = result.reviews[i].userName;
        let rating = document.createElement('p');
        rating.classList.add('rating');
        rating.textContent = `rating: ${result.reviews[i].rating}/5.0`;
        let comment = document.createElement('p');
        comment.classList.add('review-text');
        comment.textContent = result.reviews[i].review;

        profile.appendChild(profileImage);
        profile.appendChild(userName);
        profileInfo.appendChild(profile);
        profileInfo.appendChild(rating);
        reviewBox.appendChild(profileInfo);
        reviewBox.appendChild(comment);
        container.appendChild(reviewBox);
    }




    // <div class="review-box">
    //     <div class="profile-info">
    //         <div class="profile">
    //             <img src="./assets/profile-image.jpg">
    //                 <p>Fucker</p>
    //         </div>
    //         <p class="rating">Rating: 4/5</p>
    //     </div>
    //     <p class="review-text">This was a good service.</p>
    // </div>


}

loadPage();