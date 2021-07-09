import body from './config.js';

let url;


window.logout = function logout() {
    delete_cookie('authorization');
    fetch(`${url}/api/logout`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(() => window.location.href = '/login');
}


const delete_cookie = (name) => {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

document.addEventListener('DOMContentLoaded', async event => {
    url = body.url;
    const res = await fetch(`${url}/api/userDetails`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    const obj = await res.json();
    console.log(obj);

    const element = document.querySelector('#user');
    const textElement = document.createTextNode(obj.username.toUpperCase());
    element.appendChild(textElement);

    const links = obj.links;

    const table = document.querySelector('table');

    links.forEach(element => {
        const row = table.insertRow();

        const cell_1 = row.insertCell();
        const longUrl = document.createTextNode(element.longUrl);
        cell_1.appendChild(longUrl);

        const cell_2 = row.insertCell();
        const shortUrl = document.createTextNode(element.shortUrl);
        cell_2.appendChild(shortUrl);


        const cell_3 = row.insertCell();
        const element_icon = document.createElement('h5');
        element_icon.innerHTML = `<i class="fa fa-trash" aria-hidden="true" onclick="deleteLink('${element.shortUrl}')">`
        cell_3.appendChild(element_icon);

    });

})

async function deleteLink(link) {
    console.log(`Deleting ${link}`);
    const obj = {
        link
    }
    const res = await fetch(`${url}/api/deleteLink`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    });

    if (res.status !== 200) {
        res.json().then(obj => alert(obj));
    } else {
        location.reload();
    }

}

window.addLink = async function addLink() {
    const inputVal = document.querySelector('#inputMain').value;
    const obj = {
        longUrl: inputVal
    }
    const res = await fetch(`${url}/shorten`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    });
    if (res.status !== 200) {
        res.json().then(obj => alert(obj));
    } else {
        location.reload();
    }
}

window.home = function home() {
    window.location.href = '/dashboard';
}

window.account = function account() {
    window.location.href = '/account';
}