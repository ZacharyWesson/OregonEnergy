# GEOG 370
**GEOG 370 Cartography | Oregon State University | Winter 2020**

**TA: [Brian G. Katz](https://github.com/briangkatz) - katzbr@oregonstate.edu**

---

### Lab 2

#### [Effect of Normalization](normalization.html)

- How does a map of aggregate population look different from a map of normalized population?

#### [Effect of Different Classes](classes.html)

- How do the spatial patterns on maps change when represented with different number of classes? 

---

### Code Walkthrough

`normalization.js`

##### Step 1: Map

```javascript
// Create Leaflet map object, set map center and zoom level
var mymap = L.map('map', {center: [44.5, -123.5], zoom: 9});

// Add base map tile layer to Leaflet map object
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    opacity: 0,  // base map invisible at opacity 0
    maxZoom: 15,
    minZoom: 9,
    detectRetina: true,
    attribution: 'Benton County Census Tracts (2000) &copy; U.S. Census | Author: Brian G. Katz'
}).addTo(mymap);

```

##### Step 2: Colors

```javascript
// Set color palette and number of colors
colors = chroma.scale('YlOrRd').mode('hsl').colors(5);

// Function to assign colors based on attribute SQL
function setColor(attribute) {
    var id = 0;
    if (attribute > 492 && attribute <= 621) { id = 4; }
    else if (attribute > 337 && attribute <= 492) { id = 3; }
    else if (attribute > 188 &&  attribute <= 337) { id = 2; }
    else if (attribute > 85 &&  attribute <= 188) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

// Function to style spatial features using attribute-based color assignment function defined above
function style(feature) {
    return {
        fillColor: setColor(feature.properties.P087002),  // Population below poverty line
        fillOpacity: 1,
        weight: 1,
        opacity: 1,
        color: '#000000'
    };
}
```

##### Step 3: Interactive Features

```javascript
// Add interactivity to spatial features
// Define a null variable for use in functions below; later, geojson will refer to the actual data
var geojson = null;

// Function to highlight spatial features and update description text
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 8,
        opacity: 0.8,
        color: '#fdffdc',
        fillColor: '#ffff18',
        fillOpacity: 0.5
    });
    layer.bringToFront();
    $(".update").html('<b>Population below poverty line:<br>' + layer.feature.properties.P087002 + '</b><br>in  ' + layer.feature.properties.CNAME + '');
}

// Function to zoom to the bounding box of a spatial feature
function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}

// Function to reset highlighted spatial features and revert description text
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    $(".update").html("Hover over a census tract");
}

// Function to assign interactive functions to mouse events
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        click: zoomToFeature,
        mouseout: resetHighlight
    });
}

// Load GeoJSON spatial features and add to map object
geojson = L.geoJson.ajax("assets/benton.geojson", {
    style: style,
    onEachFeature: onEachFeature
}).addTo(mymap);
```

##### Step 4: Legend

```javascript
// Create a legend object and assign its position on the map
var legend = L.control({position: 'topright'});

// Add legend colors and labels, and then add to map
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b>Population Below Poverty Line (Aggregate)</b><br />';  // Legend title
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p><=621</p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p><=492</p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p><=337</p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p><=188</p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p><=85</p>';
    return div;
};
legend.addTo(mymap);

```

##### Step 5: Scale Bar

```javascript
// Add scale bar object to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);
```

