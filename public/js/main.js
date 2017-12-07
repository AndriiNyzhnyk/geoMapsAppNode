window.onload = function () {
    const socket = io();
    let map;
    let marker;

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
            map = myMap;
            resolve(myMap);
        });
    }

    function addMarker(myMap, userName, lat, lng) {
        return new  Promise(resolve => {
            marker = L.marker([lat,lng]);
            console.log(marker);
            marker.addTo(myMap);
            marker.bindPopup(userName).openPopup();
            resolve();
        });
    }

    function removeMarker(deleteUser) {
        map.removeLayer(marker);
        console.log(deleteUser.userName + ' deleteUser');
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
            const position = await getPosition();
            const lat = position.lat;
            const lng = position.lng;

            if(userName && lat && lng) {
                let myMap = await createMap(lat, lng);
                await addMarker(myMap, userName, lat, lng);
                let status = await sendDataUser(userName, lat, lng);
                if(status) console.log('data send to server');
            }

        } catch(e) {
            console.error(e);
        }

    })();

    socket.on('allUsers', (connectedUsers) => {
        for(marker in connectedUsers) {
            const userName = connectedUsers[marker].userName;
            const lat = connectedUsers[marker].lat;
            const lng = connectedUsers[marker].lng;

            addMarker(map, userName, lat, lng);
        }
        console.log(connectedUsers);
        console.log('allUsers');
    });

    socket.on('newUser', (dataUser) => {
        console.log(`dataUser ${dataUser}`);
        addMarker(map, dataUser.userName, dataUser.lat, dataUser.lng);
    });

    socket.on('deleteUser', (deleteUser) => {
        removeMarker(deleteUser);
    });


};