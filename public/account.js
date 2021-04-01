function home() {
    window.location.href = '/dashboard';
}

function logout() {
    delete_cookie('authorization');
    fetch('http://localhost:3500/api/logout', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(() => window.location.href = '/login');
}


document.addEventListener('DOMContentLoaded', async event => {
    const res = await fetch('http://localhost:3500/api/userDetails', {
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

async function updateInfo() {
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

    const res = await fetch('http://localhost:3500/api/updateInfo', {
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
        res.json().then(obj => alert(obj));
    }

}

const delete_cookie = (name) => {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};