window.onload = () => {
    const socket = io();
    let map;
    let allUsers = {};

    function getPosition() {
        return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition( position => {
                const lat = position.coords.latitude + Math.random();
                const lng = position.coords.longitude + Math.random();
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
                .bindPopup(userName)
                .openPopup();

            resolve(marker);
        });
    }

    function removeMarker(marker) {
        map.removeLayer(marker);
    }

    function addUsers(id, userName, lat, lng, marker) {
        return new Promise( resolve => {
            let user = {
                id,
                userName,
                lat,
                lng,
                marker
            };

            allUsers[id] = user;
            resolve(user);
        });
    }

    function sendDataUser(user) {
        return new Promise(resolve => {
            socket.emit('addUser', JSON.stringify(user));
            resolve(true);
        });
    }

    function getAllUsers() {
        return new Promise( resolve => {
            socket.emit('getUsers');
            resolve(true);
        });
    }

    (async function init() {
        try {
            const userName = prompt('Hello! What is your name ?','');
            const position = await getPosition();
            const lat = position.lat;
            const lng = position.lng;
            const userId = socket.id;

            if(userName && lat && lng) {
                const myMap = await createMap(lat, lng);
                const marker = await addMarker(myMap, userName, lat, lng);
                const user = await addUsers(userId, userName, lat, lng);
                const updateUser = await getAllUsers();
                const status = await sendDataUser(user);

                if(status && updateUser) console.log('OK');

            } else {
                alert("Data incorrect");
            }

        } catch(e) {
            console.error(e);
        }

    })();

    async function registerUser(id, userName, lat, lng) {
        const user = await addUsers(id, userName, lat, lng);
        const mark =  await addMarker(map, userName, lat, lng);
        allUsers[id].marker = mark;
    }

    socket.on('allUsers', (connectedUsers) => {
        const users = JSON.parse(connectedUsers);
        for(id in users) {
            const userName = users[id].userName;
            const lat = users[id].lat;
            const lng = users[id].lng;

            registerUser(id, userName, lat, lng);
        }
    });

    socket.on('newUser', (dataUser) => {
        const user = JSON.parse(dataUser);
        const id = user.id;
        const userName = user.userName;
        const lat = user.lat;
        const lng = user.lng;

        registerUser(id, userName, lat, lng);
    });
    
    socket.on('deleteUser', (id) => {
        setTimeout(function () {
            removeMarker(allUsers[id].marker);
            delete allUsers[id];
        },0)
    });
};