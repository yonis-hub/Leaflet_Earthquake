console.log('loading logic.js')

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL and send it to creatMagnigtude function
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createMagnitude(data.features);
});

function createMagnitude(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h2>" + feature.properties.place + "</h2><p>" + feature.properties.mag + " Magnitude</p><p>" + "</h2><p>" + feature.geometry.coordinates[2] + " Depth</p><p>" + new Date(feature.properties.time) + "</p>");
  }
  
  // Function to update the marker size for map readability
  function markerSize(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 3;
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
        return new L.circleMarker(latlng, {
            radius: markerSize(feature.properties.mag),
            color: "white",
            weight: 1,
            fill: true,
            fillColor: (depthColor(feature.geometry.coordinates[2])),
            fillOpacity: 1
        })
    },

    // Call function
    onEachFeature: onEachFeature

});
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


// Define the color of the marker based on the depth of the earthquake.
function depthColor(depth) {
  switch (true) {
    case depth > 90:
      return "#f63f0a"; 
    case depth > 70:
      return "#ff6219";
    case depth > 50:
      return "#ff8a19";
    case depth > 30:
      return "#ffb519";
    case depth > 10:
      return "#ffe919";
    default:
      return "#ebff19"; 
  }
}


function createMap(earthquakes) {

  // Define tile layers
  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  var grayscaleMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satelliteMap,
    "GrayScale": grayscaleMap,
    "Dark Map": darkmap,
    "Outdoors": outdoorsMap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    // faultLines: tectonicPlates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var earthquakeMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 2.5,
    layers: [darkmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(earthquakeMap);


      // Create legend for Depth of each earthquake
      var legend = L.control({ position: "bottomright" });
      legend.onAdd = function() {
          var div = L.DomUtil.create("div", "info legend"), 
          magnitudeLevels = [0, 10, 30, 50, 70, 90];
  
  
          for (var i = 0; i < magnitudeLevels.length; i++) {
              div.innerHTML +=
                  '<i style="background: ' + depthColor(magnitudeLevels[i] + 1) + '"></i> ' +
                  magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
          }
          return div;
      };
  
      // Add the legend to the map
      legend.addTo(earthquakeMap);
}
