const formEl = document.querySelector('form');
const ipInputEl = document.querySelector('.ip-input');
const ipEl = document.querySelector('.ip-info');
const locationEl = document.querySelector('.location-info');
const timezoneEl = document.querySelector('.timezone-info');
const ispEl = document.querySelector('.isp-info');

const modal = document.getElementById('modal');
const errorMsgEl = document.getElementById('error-message');
const closeBtn = document.getElementById('close-btn');

const map = L.map('map').setView([0, 0], 13);
const tileUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

L.tileLayer(tileUrl, {
    maxZoom: 18,
    attribution: false,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

const locationIcon = L.icon({
    iconUrl: 'images/icon-location.svg',
    iconSize: [27, 35],
    iconAnchor: [15, 15]
});

const marker = L.marker([0, 0], {icon: locationIcon}).addTo(map);

formEl.onsubmit = (e) => {
    e.preventDefault();
    
    fetch(`https://ipapi.co/${ipInputEl.value}/json/`)
        .then(res => res.json())
        .then(data => renderResults(data))
        .catch(error => displayError(error));
    
    e.target.reset();
}

fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => renderResults(data))
    .catch(error => displayError(error));

function renderResults(data) {
    if (data.error) {
        throw(`${data.reason}`);
    }
    ipEl.textContent = data.ip;
    locationEl.textContent = `${data.city},
    ${data.region},
    ${data.country_name}`;
    if (data.utc_offset !== null) {
        timezoneEl.textContent = 'UTC: ' + data.utc_offset.slice(0, 3) + ':' + data.utc_offset.slice(3);
    }
    else {
        timezoneEl.textContent = data.timezone;
    }
    ispEl.textContent = data.org;
    map.setView([data.latitude, data.longitude], 13);
    marker.setLatLng([data.latitude, data.longitude]);
    // marker.bindPopup(`<b>${data.ip}</b>`).openPopup();
}

function displayError(e) {
    modal.style.display = "flex";
    errorMsgEl.textContent = e;
}

closeBtn.onclick = () => {
    modal.style.display = "none";
}