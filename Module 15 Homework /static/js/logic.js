// Store the API endpoint in our queryUrl variable
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Query the URL
d3.json(queryURL).then(function (data){
    // console.log(data);
    createFeatures(data.features);
});

// circle color function
function circleColor(depth) {
  if (depth < 10) return "green";
  else if (depth < 30) return "greenyellow";
  else if (depth < 50) return "yellow";
  else if (depth < 70) return "orange";
  else if (depth < 90) return "orangered";
  else return "red";
};

function createFeatures(quakeFeatures) {

    // popups that provide info about the earthquake when the marker is clicked
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
        <p>${new Date(feature.properties.time)}</p>
        <p>Magnitude: ${feature.properties.mag}</p>
        <p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    // layer that contains the features including the circleMarker attributes
    var quakes = L.geoJSON(quakeFeatures, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return new L.circleMarker(latlng, {
                fillOpacity: 0.75,
                color: circleColor(feature.geometry.coordinates[2]),
                weight: 0.1,
                fillColor: circleColor(feature.geometry.coordinates[2]),
                radius: feature.properties.mag *4})
        }
    });

    createMap(quakes);
};

function createMap(quakes) {

    // create the base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    // create a baseMaps object
    let baseMaps = {
      "Street Map": street,
    };
  
    // create an overlay object to hold our overlay
    let overlayMaps = {
      Earthquakes: quakes
    };
  
    // create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, quakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  

  
  // add the legend to the map
  let info = L.control({
    position: "bottomright",
  });

  info.onAdd = function () {
    let legend = L.DomUtil.create("div", "info legend");

    depths = [-10, 10, 30, 50, 70, 90];
    squareColors = ["green", "greenyellow", "yellow", "orange", "orangered", "red"]

    legend.innerHTML += `<h3>Depth of Earthquakes<br>___________________</br></h3>`


    for (let i=0; i<depths.length; i++) {
      legend.innerHTML += "<i style='background:" + squareColors[i] + "'></i>" + 
        depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+")
    }


  return legend;
  };
  
  info.addTo(myMap);

};