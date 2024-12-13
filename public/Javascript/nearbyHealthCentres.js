function initMap() {
    // Center the map on the user's current location
    navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
        
        const map = new google.maps.Map(document.getElementById("map"), {
            center: userLocation,
            zoom: 12,
        });

        // Create the request to search nearby
        const request = {
            location: userLocation,
            radius: '5000', // Radius in meters
            type: ['hospital'], // Types of places to search
        };

        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
                    createMarker(results[i], map);
                }
            }
        });
    });
}

function createMarker(place, map) {
    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
        title: place.name,
    });
    
    google.maps.event.addListener(marker, "click", () => {
        const infoWindow = new google.maps.InfoWindow({
            content: `<h4>${place.name}</h4><p>${place.vicinity}</p>`,
        });
        infoWindow.open(map, marker);
    });
}
