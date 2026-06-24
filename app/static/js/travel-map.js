var travelMaps = {};
var DEFAULT_MAP_CENTER = [20, 0];
var DEFAULT_MAP_ZOOM = 2;

function initTravelMaps() {
    document.querySelectorAll(".travel-map").forEach(function (container) {
        initTravelMapIfNeeded(container);
    });
}

function initTravelMapIfNeeded(container) {
    if (!container.dataset.initialized && typeof L !== "undefined") {
        initTravelMap(container);
        container.dataset.initialized = "true";
        setTimeout(function () {
            var memberId = container.dataset.memberId;
            resizeTravelMap(memberId);
        }, 100);
    }
}

function initTravelMap(container) {
    if (typeof L === "undefined") {
        return;
    }

    var markerIconUrl = container.dataset.markerIcon || "/static/img/marker-pin.svg";
    var travelMarkerIcon = L.icon({
        iconUrl: markerIconUrl,
        iconSize: [32, 48],
        iconAnchor: [16, 48],
        popupAnchor: [0, -48],
    });

    var memberId = container.dataset.memberId;
    var listEl = document.getElementById("travel-map-list-" + memberId);
    var places = [];
    try {
        places = JSON.parse(container.dataset.places || "[]");
    } catch (error) {
        console.error("Could not read places for member", memberId, error);
    }

    var map = L.map(container).setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
    }).addTo(map);

    function updateList() {
        if (!listEl) {
            return;
        }

        listEl.innerHTML = "";

        if (!places.length) {
            listEl.innerHTML =
                "<li class='travel-map-empty'>No places marked yet.</li>";
            return;
        }

        places.forEach(function (place) {
            var item = document.createElement("li");
            item.textContent = place.name || "Visited location";
            item.title = place.lat.toFixed(4) + ", " + place.lng.toFixed(4);
            listEl.appendChild(item);
        });
    }

    function renderMarkers() {
        places.forEach(function (place) {
            var marker = L.marker([place.lat, place.lng], { icon: travelMarkerIcon }).addTo(map);
            marker.bindPopup(place.name || "Visited location");
        });

        updateList();
    }

    renderMarkers();
    map.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);
    travelMaps[memberId] = map;
}

function resizeTravelMap(memberId) {
    var map = travelMaps[memberId];
    if (!map) {
        return;
    }

    map.invalidateSize();
    map.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);
}

window.initTravelMaps = initTravelMaps;
window.initTravelMapIfNeeded = initTravelMapIfNeeded;
