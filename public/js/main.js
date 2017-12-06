window.onload = function () {
    const socket = io();

    function getPosition() {
        return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition( (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                resolve({lat,lng});
            });

        });
    }

    function createMap(lat, lng) {
        return new Promise( resolve => {
            let myMap = L.map('mapid').setView([lat, lng], 13);
            L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(myMap);
            resolve(myMap);
        });
    }

    function addMarker(myMap, lat, lng) {
        return new  Promise(resolve => {
            const marker = L.marker([lat,lng]).addTo(myMap);
            resolve();
        });
    }

    function removeMarker() {

    }


    function sendDataUser(userName, lat, lng) {
        return new Promise(resolve => {
            let dataUser = {
                userName,
                lat,
                lng
            };

            socket.emit('addUser', dataUser);
            resolve(true);
        });
    }

    (async function init() {
        try {
            const userName = prompt('Hello! What is your name ?');
            let position = await getPosition();

            if(userName && position.lat && position.lng) {
                let myMap = await createMap(position.lat, position.lng);
                await addMarker(myMap, position.lat, position.lng);
            }

            let status = await sendDataUser(userName, position.lat, position.lng)
            if(status) console.log('data send to server');
        } catch(e) {
            console.error(e);
        }

    })();

};