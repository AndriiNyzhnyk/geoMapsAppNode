window.onload = function () {
    const socket = io();
    let map;
    let allUsers = {};

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
            const marker = L.marker([lat,lng])
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

    function addUsers(id, userName, lat, lng) {
        return new Promise( resolve => {
            user = {
                id: id,
                userName: userName,
                lat: lat,
                lng: lng
            };

            allUsers[id] = user;
            resolve(user);
        });
    }

    function sendDataUser(user) {
        return new Promise(resolve => {
            socket.emit('addUser', user);
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
                const user = await addUsers(socket.id, userName, lat, lng);
                let status = await sendDataUser(user);

                if(status) {
                    // socket.emit('getUsers');
                    console.log('data send to server');
                }

            } else {
                alert("Data incorrect");
            }

        } catch(e) {
            console.error(e);
        }

    })();

    socket.on('allUsers', (connectedUsers) => {
        for(id in connectedUsers) {
            const userName = connectedUsers[id].userName;
            const lat = connectedUsers[id].lat;
            const lng = connectedUsers[id].lng;

            addUsers(id, userName, lat, lng);
            addMarker(map, userName, lat, lng);
        }
        // console.log(allUsers);
    });

    socket.on('newUser', (dataUser) => {
        const id = dataUser.id;
        const userName = dataUser.userName;
        const lat = dataUser.lat;
        const lng = dataUser.lng;

        addUsers(id, userName, lat, lng);
        addMarker(map, userName, lat, lng);
    });
    
    socket.on('deleteUser', (user) => {
        console.log(user);
    });

    setTimeout( () => {
        socket.emit('getUsers');
        console.log(allUsers);
    }, 4000)

};