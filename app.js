// Create map and center on Singapore
var map = L.map('map').setView([1.3521, 103.8198], 11);

// Add the OpenStreetMap tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



/* ==========================================================
   MARKERS
   Adds markets signifying the sounds
   ========================================================== */

// Create blue, purple, and red pin

var blue_pin = L.icon({
    iconUrl: "icon/blue_pin.png",
    iconSize:     [32, 32], // size of the icon
    iconAnchor:   [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -32] // point from which the popup should open relative to the iconAnchor
});

var purple_pin = L.icon({
    iconUrl: "icon/purple_pin.png",
    iconSize:     [32, 32], // size of the icon
    iconAnchor:   [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -32] // point from which the popup should open relative to the iconAnchor
});

var red_pin = L.icon({
    iconUrl: "icon/red_pin.png",
    iconSize:     [32, 32], // size of the icon
    iconAnchor:   [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -32] // point from which the popup should open relative to the iconAnchor
});



// Add a simple marker
var marker1 = L.marker([1.3521, 103.8198], {icon: blue_pin}).addTo(map);
marker1.bindPopup("<b>Hello Singapore!</b><br>I am a popup.");


var marker2 = L.marker([1.4521, 103.8198], {icon: purple_pin}).addTo(map);
marker2.bindPopup("<b>Hello Singapore!</b><br>I am a popup.");

/* ==========================================================
   GEO-JSON FILE
   Adds the districts to the map from a GeoJSON file with interactivity
   ========================================================== */

// Declare geojson variable
var geojson;

/**
 * NEW: The main style function.
 * This tells Leaflet how to style each district *before* it is hovered over.
 */
function style(feature) {
    return {
        fillColor: '#cccccc', // Use our new color function
        fillOpacity: 0.2,
        weight: 2,         // Border width
        opacity: 1,
        color: 'white',    // Border color
        color: '#000000ff', // Default border color
        dashArray: '3'
    };
}

// Highlight districts on hover
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#665', // Dark border on hover
        dashArray: '',
        fillOpacity: 0.5
    });

    layer.bringToFront();
}

// Reset highlight on mouseout
function resetHighlight(e) {
    geojson.resetStyle(e.target); // This resets to the default 'style' function
}

// Zoom to feature on click
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

// Function to apply to each feature
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// --- Now, fetch your data and apply the functions ---

fetch('region_map.geojson')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // Create the interactive layer and assign it to the 'geojson' variable
        geojson = L.geoJson(data, {
            style: style, // <-- THIS IS THE KEY ADDITION
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(function(error) {
        console.error('Error loading the GeoJSON file:', error);
    });