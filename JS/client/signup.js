// http://localhost:3000/create-user?userID=4561&userName=Jeeshan3&password=1234&isOwner=1

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


async function createUser(userID, userName, password, isOwner) {
    let response = await fetch(`http://localhost:3000/create-user?userID=${userID}&userName=${userName}&password=${password}&isOwner=${isOwner}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });
    let data = await response.json();
    if (data.error) {
        return;
    }
    else {
        // send to login page
        document.location.href = (location.protocol + '//' + location.host + "/index.html");
    }
}


async function signUp() {
    let userID = getRandomString("ID");
    let isOwner = document.querySelectorAll('select')[0].value;
    let userName = document.querySelectorAll('input')[0].value;
    let password = document.querySelectorAll('input')[1].value;

    await createUser(userID, userName, password, isOwner)

}
