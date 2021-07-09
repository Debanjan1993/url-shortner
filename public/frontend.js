import obj from './config.js';

let url;

document.addEventListener('DOMContentLoaded', async event => {
    url = obj.url;
})


window.sendSignUpData = function sendSignUpData() {
    const personName = document.querySelector('#name').value;
    const email = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const password2 = document.querySelector('#confirmPassword').value;
    const signupbtn = document.querySelector('#signupbtn');

    const obj = {
        personName,
        email,
        password,
        password2
    }

    fetch(`${url}/api/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    }).then(res => {
        if (res.status === 201) {
            window.location.href = '/login'
        } else {
            res.json().then(json => alert(json));
        }
    });

}

window.login = function login() {
    const username = document.querySelector('#loginEmail').value
    const password = document.querySelector('#loginPassword').value

    const obj = {
        username,
        password
    }

    fetch(`${url}/api/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    }).then(res => {
        if (res.status === 200) {
            res.json().then(token => {
                document.cookie = `authorization=Bearer ${token}`;
                window.location.href = '/dashboard';
            });
        } else {
            res.json().then(json => alert(json));
        }
    });
}