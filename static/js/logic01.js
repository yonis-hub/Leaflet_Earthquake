console.log('loading logic.js')


var myMap = L.map("mapid", {
    center: [8.7832, 34.5085],
    zoom: 3
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  
//Function to set colors corresponding to earthquake magnitude: size and depth
function depthColor(depth) {
  switch (true) {
    case depth > 90:
        return "#FF0000";
    case depth > 70:
        return "#FFA500";
    case depth > 50:
        return "#F8d568";
    case depth > 30:
        return "#FFFF00";
    case depth > 10:
        return "#9acd32";
    default:
        return "#00FF00";
  }
}

// connect to USGS GEOJSON API
var URl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log(URl)

//reqest to the query URL
d3.json(queryUrl).then(function(data) {
  L.geoJSON(data, {
      pointToLayer: function(geoJsonPoint, latlng) {
          return L.circleMarker(latlng);
      },
      style: function (feature) {
          return {color: "white",
                  opacity: 1,
                  fillOpacity: 1, 
                  weight: .5, 
                  radius: feature.properties.mag * 5,
                  fillColor: depthColor(feature.geometry.coordinates[2]) };
      },
      
  //add legend
  var legend = L.control({
      position: "bottomright", 
  });

  //details for legend
  legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var grades = [10, 30, 50, 70, 90]; 
      var colors = [
          "red",
          "orange",
          "gold",
          "yellow",
          "SpringGreen",
          "GreenYellow"
      ];
      //Display markers describing time and place of earthquake
      onEachFeature
  }).bindPopup(function (layer) {
      return layer.feature.properties.description;
  }).addTo(myMap);
  //createFeatures(data.features);
});
