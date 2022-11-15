async function changePage(userName, password) {
    let response = await fetch(`http://localhost:3000/login?userName=${userName}&password=${password}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    let data = await response.json();
    console.log(data);
    if (data.error) {
        return;
    }
    else {

        // how to set and get
        // localStorage['names']=JSON.stringify(names); var storedNames=JSON.parse(localStorage['names']);

        localStorage['userID'] = JSON.stringify(data.user.userID);


        if(data.user.isOwner === 1)
        {
            document.location.href = (location.protocol + '//' + location.host + "/owner-dashboard.html");
        }
        else
        {
            document.location.href = (location.protocol + '//' + location.host + "/user-dashboard.html");
        }
    }
    // login if no error
}


function login() {
    let userName = document.querySelectorAll('input')[0].value;
    let password = document.querySelectorAll('input')[1].value;

    console.log(userName, password);
    changePage(userName, password);
}



