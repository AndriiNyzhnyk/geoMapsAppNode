window.onload = function () {
    const socket = io();
    let myMap;

    function createMap(lat, lng) {
        myMap = L.map('mapid').setView([lat, lng], 13);
        L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(myMap);
    }

    function addMarker(lat,lng) {
        const marker = L.marker([lat,lng]).addTo(myMap);
    }

    function removeMarker() {

    }

    function getPosition() {
        return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition( (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                resolve({lat,lng});
            });

        });
    }

    (async function init() {
        const userName = prompt('Hello! What is your name ?');
        let position = await getPosition();

        if(userName && position.lat && position.lng) {
            // socket.emit('addUser', dateUser);
            createMap(position.lat, position.lng);
            addMarker(position.lat, position.lng);
        }
    })();

};


