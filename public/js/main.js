window.onload = function () {
    const socket = io();
    let map;

    function getPosition() {
        return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition( position => {
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
        return new Promise(resolve => {
            const marker = new L.marker([lat,lng])
                .addTo(myMap)
                .bindPopup(userName).openPopup();

            // removeMarker(marker);
            // myMap.addLayer(marker);
            resolve(marker);
        });
    }

    function removeMarker(marker) {
        map.removeLayer(marker);
    }


    function sendDataUser(marker, userName, lat, lng) {
        return new Promise(resolve => {
            let dataUser = {
                marker: marker,
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
                let marker = await addMarker(myMap, userName, lat, lng);
                let status = await sendDataUser(marker, userName, lat, lng);
                if(status) console.log('data send to server');
            } else {
                alert("Data incorrect");
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
    
    socket.on('deleteUser', (user) => {
        console.log(user);
    });

};