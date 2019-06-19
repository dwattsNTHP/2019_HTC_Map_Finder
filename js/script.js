var southWest = L.latLng(12, -179);
var northEast = L.latLng(71, -47);

var map = L.map('map', {zoomControl: false, maxBounds: L.latLngBounds(southWest, northEast)}).setView([39.828049, -98.578857], 5);
            
var backgroundMap = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    minZoom: 4,
    maxZoom: 9
});
        
backgroundMap.addTo(map);

var usStates;
var congDists;

var selection;

var selectedLayer;

//Style and Add US Outline Layer

var usBorder = L.esri.featureLayer({
    url: 'https://services3.arcgis.com/8mRVhBBtAu5eqZUu/arcgis/rest/services/US_Boundary/FeatureServer/0', 
    style: {
        color: '#202f49',
        weight: 1.5,
        fillOpacity: 0
    }    
}).addTo(map);

//Style and Add State Layer + Add popup text

function stateStyle(feature) {
    return {
        color: '#00679d',
        weight: .8,
        opacity: .6,
        fillColor: '#7ed3f6',
        fillOpacity: .1
    };
}

function stateSelectedStyle(feature) {
    return {
        weight: 3,
        color: '#202f49',
        fillOpacity: 0.4
    };
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function stateOnEachFeature(feature, layer) {
    layer.on({
        click: function(e) {
            if (selection) {
                resetStyles();
            }
        
            e.target.setStyle(stateSelectedStyle());
            selection = e.target;
            selectedLayer = usStates;
            
            layer.bringToFront(e);
            L.DomEvent.stopPropagation(e);
        }
    });
}


map.createPane('usStatePane');

var usStates = L.esri.featureLayer({
    url: 'https://services3.arcgis.com/8mRVhBBtAu5eqZUu/arcgis/rest/services/US_State_Boundaries_HTC/FeatureServer/0', 
    pane: 'usStatePane',
    where: "NAME <> 'Puerto Rico'",
    style: stateStyle,
    onEachFeature: stateOnEachFeature
});

usStates.addTo(map);

var stateTemplate = '<table><tbody><tr><td><strong><font size="3">{NAME}</font></strong></td></tr><table><tbody><tr><td style="padding-top: 5px;"><strong><a href={URL} target="_blank">Click here for HTC map and economic factsheet</a></strong></td></tr></tbody></table>';
  
usStates.bindPopup( function (layer) {
    return L.Util.template(stateTemplate, layer.feature.properties);
});


//Style and Add CD Layer + Add popup text



function congStyle(feature) {
    if(feature.properties.Party === 'R'){
        return {color: '#ff0000', weight: .4, fillColor: '#ff0000', fillOpacity: .3};
    } else if (feature.properties.Party === 'D'){
        return {color: '#4177f4', weight: .4, fillColor: '#4177f4', fillOpacity: .4}
    }
};


function congSelectedStyle(feature) {
    return {
        weight: 2,
        color: '#202f49',
        fillOpacity: 0.7
    };
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}


function congOnEachFeature(feature, layer) {
    layer.on({
        click: function(e) {
            if (selection) {
                resetStyles();
            }
        
            e.target.setStyle(congSelectedStyle());
            selection = e.target;
            selectedLayer = congDists;
            
            layer.bringToFront(e);
            L.DomEvent.stopPropagation(e);
        }
    });      
}

var congFilter = function(feature) {
	if (feature.properties.Group_ === '1') return true
}

map.createPane('congDistPane');

var congDists = L.esri.featureLayer({
    url: 'https://services3.arcgis.com/8mRVhBBtAu5eqZUu/arcgis/rest/services/Congressional_Districts_(116th)_Simplified/FeatureServer/0', 
    pane: 'congDistPane',
    where: "Group_ = 1",
    style: congStyle,
    onEachFeature: congOnEachFeature
});

congDists.addTo(map);

var congDistTemplate = '<center><table><tbody><tr><td><strong><font size="3">{State} | {CongDist} District</font></strong></td></tr><tr><td>Rep. {FName} {LName} ({Party})</td></tr></tbody></table><table><tbody><tr><td style="padding-top: 5px;"><strong><a href={URL} target="_blank">Click here for HTC map and economic factsheet</a></strong></td></tr></tbody></table></center>';

congDists.bindPopup(function (layer) {
    return L.Util.template(congDistTemplate, layer.feature.properties);
});

// Code to reset layers

map.addEventListener('click', function(e) {
    if (selection) {
        resetStyles();
        selection = null
    }
});

function resetStyles(){
    if (selectedLayer === congDists) selectedLayer.resetStyle(selection);
    else if (selectedLayer === usStates) selectedLayer.resetStyle(selection);
}

//Add Zoom Control 

var zoomHome = L.Control.zoomHome();
zoomHome.addTo(map);

//Add Buttons to control map layers on/off

$("#btnStates").click(function(){
    if (map.hasLayer(usStates)){
        map.removeLayer(usStates);
        $("#btnStates").html("Turn States On");
    } else {
        map.addLayer(usStates);
        $("#btnStates").html("Turn States Off");
    }
});

$("#btnCongDist").click(function(){
    if (map.hasLayer(congDists)){
        map.removeLayer(congDists);
        $("#btnCongDist").html("Turn Districts On");
    } else {
        map.addLayer(congDists);
        $("#btnCongDist").html("Turn Districts Off");
    }
});

$(() => {
    'use strict';
    $('#btnStates').click(function() {
        var $this = $(this);
        $this.toggleClass('pressed', 4000);
    });
});

$(() => {
    'use strict';
    $('#btnCongDist').click(function() {
        var $this = $(this);
        $this.toggleClass('pressed', 4000);
    });
});

//JQuery to control X button for info box

$("#closeButton").click(function(){
    $("div.infobox").fadeToggle(1000);
});

//Jquery to control easy button

var infoBox = L.easyButton('fa-info-circle fa-lg',  function(btn) {
    $("div.infobox").fadeToggle(1000);
}, 'Info Box').addTo(map);


