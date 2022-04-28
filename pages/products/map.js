var map = L.map('map').setView([51.505, -0.09], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

getProducts();
let items = JSON.parse(localStorage.getItem('products'));

for (let i = 0; i < items.length; i++) {
    if (parseFloat(items[i].x) !== 0 && parseFloat(items[i].y) !== 0) {
        L.marker([parseFloat(items[i].x), parseFloat(items[i].y)]).addTo(map)
            .bindPopup(items[i].name)
            .openPopup();
    }

}










