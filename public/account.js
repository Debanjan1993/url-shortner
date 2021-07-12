import body from './config.js';

let url;

window.home = function home() {
    window.location.href = '/dashboard';
}

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


document.addEventListener('DOMContentLoaded', async event => {
    toastr.options.timeOut = 4 * 1000;
    toastr.options.showMethod = 'slideDown';
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

    const nameElem = document.querySelector('#inputName');
    const emailElem = document.querySelector('#inputEmail');

    nameElem.value = obj.username;
    emailElem.value = obj.email;
})

window.updateInfo = async function updateInfo() {
    const name = document.querySelector('#inputName').value;
    const email = document.querySelector('#inputEmail').value;
    const password = document.querySelector('#inputSub').value;
    const password2 = document.querySelector('#inputSubTemp').value;

    const obj = {
        name,
        email,
        password,
        password2
    }

    const res = await fetch(`${url}/api/updateInfo`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })

    if (res.status === 200) {
        logout();
    } else {
        res.json().then(obj => toastr.error(obj));
    }

}

const delete_cookie = (name) => {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};