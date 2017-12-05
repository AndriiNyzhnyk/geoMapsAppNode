const socket = io();
dateUser = {};

const myModule = {
    init: function () {
        navigator.geolocation.getCurrentPosition( (position) => {
            dateUser.lat = position.coords.latitude;
            dateUser.lng = position.coords.longitude;

            dateUser.userName = prompt('Hello! What is your name ?');

            if(dateUser.userName && dateUser.lat && dateUser.lng) {
                socket.emit('addUser', dateUser);
                this.mymap = L.map('mapid').setView([dateUser.lat, dateUser.lng], 13);
                L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.mymap);
                this.addMarker(dateUser.lat, dateUser.lng);
            }
        });
    },
    addMarker: function(lat, lng) {
        const marker = L.marker([lat,lng]).addTo(this.mymap);
    },
    removeMarker: function () {

    }
};
window.onload = myModule.init();


