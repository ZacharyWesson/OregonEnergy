// Map 1: Show electricity production sites,
//symbolized by nameplate capacity (size of dot) and production type (color of dot)

// Create Leaflet map object, set map center and zoom level //shift long slightly
var mymap = L.map('map', {center: [43.8, -120.5], zoom: 7});

// Add base map tile layer to Leaflet map object
var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(mymap);

// Set color palette and number of colors
colors = chroma.scale(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#ff7f00','#ffd92f']).colors(8);
console.log(colors);
// Function to assign colors based on attribute SQL (trying to color by "Source_type" field)
function getColor(attribute) {
console.log(attribute);
    var id = 0;
    //change these conditions to = source type code, can adjust colors (based on order)
    if (attribute == 1) { id = 2; } //biogas
    else if (attribute == 2) { id = 3; } //biomass
    else if (attribute == 3) { id = 5; } //geothermal
    else if (attribute == 4) { id = 1; } //hydro
    else if (attribute == 5) { id = 6; } //natural gas
    else if (attribute == 6) { id = 4; } //mixed
    else if (attribute == 7) { id = 7; } //solar (change color)
    else  { id = 0; } //wind
    return colors[id];
}
// Function to set size of circle markers // get values from original map legend //just use 5
function getRadius(attribute) {
console.log(attribute);
    return (attribute >= 1 && attribute < 100) ? 6 :
           (attribute >= 100 && attribute < 500) ? 8 :
           (attribute >= 500 && attribute < 1200) ? 12 :
           (attribute >= 1200 && attribute < 1800) ? 20 :
           (attribute >= 1800) ? 24 :
           6;  // null
}
//define a function that can return capacity value with ability to assign 'NA' to 'null'  values
// First, define function to format capacity values to be either rounded decimal number-strings or 'N/A'
function getLabel(attribute) {
	return (attribute == null) ? 'N/A' : attribute.toFixed(1).toString() + ' MW';  // toFixed() rounds to a specified # of decimal places; toString() converts numeric data type to string data type
}

// Add interactivity to spatial features
// Define a null variable for use in functions below; later, geojson will refer to the actual data
var geojson = null;


// Load GeoJSON spatial features and add to map object
geojson = L.geoJson.ajax("assets/EnergySources-820v2.geojson", {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: getRadius(feature.properties.Nameplate_Capacity),
            fillColor: getColor(feature.properties.Source_Type),
            stroke: false,
            fillOpacity: 0.67
        });
    },
    onEachFeature: function (feature, layer) {
        layer.bindTooltip(
        '<b>Name:</b> ' + layer.feature.properties.Plant_Name +'<br>' +
        '<b>Type:</b> ' + layer.feature.properties.Power_Source__group_ +'<br>' +
	    '<b>Capacity:</b> ' + getLabel(feature.properties.Nameplate_Capacity), // add unit for generation capacity, e.g. megawatts (MW) or other
        {sticky: true, className: "feature-tooltip"});
    },
    }).addTo(mymap);

// Create a legend object and assign its position on the map
var legend = L.control({position: 'bottomright'});

// Add legend colors and labels, and then add to map
//legend.onAdd = function () {
//    var div = L.DomUtil.create('div', 'legend');
//    div.innerHTML += '<b>Energy Sources</b><br />';  // Legend title
//    //order numbers how legend should look
//    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p>Hydro</p>';
//    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p>Wind</p>';
//    div.innerHTML += '<i style="background: ' + colors[6] + '; opacity: 0.5"></i><p>Natural Gas</p>';
//    div.innerHTML += '<i style="background: ' + colors[7] + '; opacity: 0.5"></i><p>Solar</p>';
//    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>Biomass</p>';
//    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>Biogas</p>';
//    div.innerHTML += '<i style="background: ' + colors[5] + '; opacity: 0.5"></i><p>Geothermal</p>';
//    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>Mixed</p>';
//    return div;
//};

// Size of circle markers in point layer legend
function getRadiusLegend(r) {
	return  r > 1 ? 9 :
			r < 1 ? 5 :
					7;
}

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'legend');
	div.innerHTML += '<p><b class="legend-title">Power Plants in Oregon</b></p>',
	div.innerHTML += '<p><b class="legend-subtitle">Energy Source Type</b></p>',
	pointColors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#ff7f00','#ffd92f'];
	categories = ['Wind', 'Hydro', 'Biogas', 'Biomass', 'Mixed', 'Geothermal', 'Natural Gas', 'Solar'],
	labels = [],
	labels.push('<i class="circlepadding" style="width: ' + Math.max(8, (7 - 2.2 * getRadiusLegend(80))) + 'px;"></i><i class="fa-border-prop-radius" style="background: ' + pointColors[0] + '; opacity: 1; width: ' + getRadiusLegend(80) * 2 + 'px; height: ' + getRadiusLegend(80) * 2 + 'px; border-radius: 50%; margin-top: ' + Math.max(0, (9 - getRadiusLegend(80))) + 'px;"></i><i class="circlepadding" style="width: ' + Math.max(2, (25 - 2 * getRadiusLegend(80))) + 'px;"></i> <span>' + categories[0] + '</span>');
	labels.push('<i class="circlepadding" style="width: ' + Math.max(8, (7 - 2.2 * getRadiusLegend(80))) + 'px;"></i><i class="fa-border-prop-radius" style="background: ' + pointColors[1] + '; opacity: 1; width: ' + getRadiusLegend(80) * 2 + 'px; height: ' + getRadiusLegend(80) * 2 + 'px; border-radius: 50%; margin-top: ' + Math.max(0, (9 - getRadiusLegend(80))) + 'px;"></i><i class="circlepadding" style="width: ' + Math.max(2, (25 - 2 * getRadiusLegend(80))) + 'px;"></i> <span>' + categories[1] + '</span>');
	labels.push('<i class="circlepadding" style="width: ' + Math.max(8, (7 - 2.2 * getRadiusLegend(80))) + 'px;"></i><i class="fa-border-prop-radius" style="background: ' + pointColors[2] + '; opacity: 1; width: ' + getRadiusLegend(80) * 2 + 'px; height: ' + getRadiusLegend(80) * 2 + 'px; border-radius: 50%; margin-top: ' + Math.max(0, (9 - getRadiusLegend(80))) + 'px;"></i><i class="circlepadding" style="width: ' + Math.max(2, (25 - 2 * getRadiusLegend(80))) + 'px;"></i> <span>' + categories[2] + '</span>');
	labels.push('<i class="circlepadding" style="width: ' + Math.max(8, (7 - 2.2 * getRadiusLegend(80))) + 'px;"></i><i class="fa-border-prop-radius" style="background: ' + pointColors[3] + '; opacity: 1; width: ' + getRadiusLegend(80) * 2 + 'px; height: ' + getRadiusLegend(80) * 2 + 'px; border-radius: 50%; margin-top: ' + Math.max(0, (9 - getRadiusLegend(80))) + 'px;"></i><i class="circlepadding" style="width: ' + Math.max(2, (25 - 2 * getRadiusLegend(80))) + 'px;"></i> <span>' + categories[3] + '</span>');
	labels.push('<i class="circlepadding" style="width: ' + Math.max(8, (7 - 2.2 * getRadiusLegend(80))) + 'px;"></i><i class="fa-border-prop-radius" style="background: ' + pointColors[4] + '; opacity: 1; width: ' + getRadiusLegend(80) * 2 + 'px; height: ' + getRadiusLegend(80) * 2 + 'px; border-radius: 50%; margin-top: ' + Math.max(0, (9 - getRadiusLegend(80))) + 'px;"></i><i class="circlepadding" style="width: ' + Math.max(2, (25 - 2 * getRadiusLegend(80))) + 'px;"></i> <span>' + categories[4] + '</span>');
	labels.push('<i class="circlepadding" style="width: ' + Math.max(8, (7 - 2.2 * getRadiusLegend(80))) + 'px;"></i><i class="fa-border-prop-radius" style="background: ' + pointColors[5] + '; opacity: 1; width: ' + getRadiusLegend(80) * 2 + 'px; height: ' + getRadiusLegend(80) * 2 + 'px; border-radius: 50%; margin-top: ' + Math.max(0, (9 - getRadiusLegend(80))) + 'px;"></i><i class="circlepadding" style="width: ' + Math.max(2, (25 - 2 * getRadiusLegend(80))) + 'px;"></i> <span>' + categories[5] + '</span>');
	labels.push('<i class="circlepadding" style="width: ' + Math.max(8, (7 - 2.2 * getRadiusLegend(80))) + 'px;"></i><i class="fa-border-prop-radius" style="background: ' + pointColors[6] + '; opacity: 1; width: ' + getRadiusLegend(80) * 2 + 'px; height: ' + getRadiusLegend(80) * 2 + 'px; border-radius: 50%; margin-top: ' + Math.max(0, (9 - getRadiusLegend(80))) + 'px;"></i><i class="circlepadding" style="width: ' + Math.max(2, (25 - 2 * getRadiusLegend(80))) + 'px;"></i> <span>' + categories[6] + '</span>');
	labels.push('<i class="circlepadding" style="width: ' + Math.max(8, (7 - 2.2 * getRadiusLegend(80))) + 'px;"></i><i class="fa-border-prop-radius" style="background: ' + pointColors[7] + '; opacity: 1; width: ' + getRadiusLegend(80) * 2 + 'px; height: ' + getRadiusLegend(80) * 2 + 'px; border-radius: 50%; margin-top: ' + Math.max(0, (9 - getRadiusLegend(80))) + 'px;"></i><i class="circlepadding" style="width: ' + Math.max(2, (25 - 2 * getRadiusLegend(80))) + 'px;"></i> <span>' + categories[7] + '</span>');
	div.innerHTML += labels.join('<br>');
	div.innerHTML += '<br>';
	div.innerHTML += '<p><b class="legend-subtitle">Generation Capacity</b></p>',
	grades = [1000, 0],
	margins = [0, 4],
	labels = [],
	categories = ['More', 'Less'];
	for (var i = 0; i < grades.length; i++) {
	var grade = grades[i];  //*0.5;
	var margin = margins[i];
	labels.push(
	'<i class="circlepadding" style="width: ' + Math.max(8, (7 - 2.2 * getRadiusLegend(grade))) + 'px;"></i><i class="fa-border-prop-radius" style="background: rgba(80, 80, 80, 0); width: ' + getRadiusLegend(grade) * 2 + 'px; height: ' + getRadiusLegend(grade) * 2 + 'px; border-radius: 50%; margin-top: ' + Math.max(0, (9 - getRadiusLegend(grade))) + 'px; margin-left: ' + margin + 'px;"></i><i class="circlepadding" style="width: ' + (Math.max(2, (25 - 2 * getRadiusLegend(grade))) - margin) + 'px;"></i> <small>' + categories[i] + '</small>');
	}
	div.innerHTML += labels.join('<br>');
	div.innerHTML += '<br>',
//	add link in h ref ""
	div.innerHTML += '<small class="reference">Data: <a href="https://oregon.gov/energy" target="_blank">Oregon Dept. of Energy</a></small>';
	return div;
};
legend.addTo(mymap);

// Add scale bar object to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Synapse as another data source https://synapse.maps.arcgis.com/apps/dashboards/201fc98c0d74482d8b3acb0c4cc47f16
// Oregon Dept of Energy as source https://www.eia.gov/electricity/data/eia860/