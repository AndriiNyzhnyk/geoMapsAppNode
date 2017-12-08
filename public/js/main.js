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

    function addUsers(id, userName, lat, lng) {
        return new Promise( resolve => {
            let user = {
                id,
                userName,
                lat,
                lng
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

    function getAllUsers() {
        return new Promise( resolve => {
            socket.emit('getUsers');
            console.log('getAllUsers()');
            console.log(allUsers);
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
                const myMap = await createMap(lat, lng);
                const marker = await addMarker(myMap, userName, lat, lng);
                const user = await addUsers(socket.id, userName, lat, lng);
                const updateUser = await getAllUsers();
                const status = await sendDataUser(user);

                if(status && updateUser) {
                    console.log('OK');
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

    // setTimeout( () => {
    //     socket.emit('getUsers');
    //     console.log(allUsers);
    // }, 4000)

};