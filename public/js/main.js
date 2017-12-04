const myModule = {
    init: function () {
        navigator.geolocation.getCurrentPosition( (position) => {
            console.log(position);
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            console.log(lat, lng);
            const marker = L.marker([lat,lng]).addTo(this.mymap);
        });
        this.mymap = L.map('mapid').setView([51.505, -0.09], 13);
        L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.mymap);
    },
    addMarker: function () {

    },
    removeMarker: function () {

    }
};

window.onload = myModule.init();