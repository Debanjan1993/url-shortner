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


const delete_cookie = (name) => {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

document.addEventListener('DOMContentLoaded', event => {
    fetch('http://localhost:3500/api/userDetails', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((obj) => obj.json())
        .then(data => console.log(data));
})